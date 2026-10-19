import * as XLSX from 'xlsx';
import { MilkType, RateConfig } from '../types/dairy';

// Standard baseline formula defaults
export const DEFAULT_FORMULA_SETTINGS = {
  cowBaseRate: 36.50,
  cowBaseFat: 3.5,
  cowBaseSnf: 8.5,
  cowFatIncrement: 0.45, // ₹ per 0.1 fat deviation
  cowSnfIncrement: 0.35, // ₹ per 0.1 snf deviation
  buffaloBaseRate: 64.00,
  buffaloBaseFat: 6.5,
  buffaloBaseSnf: 9.0,
  buffaloFatIncrement: 0.60,
  buffaloSnfIncrement: 0.40,
};

// Generate default pre-computed matrix
export function generateDefaultRateGrid(): Record<string, number> {
  const grid: Record<string, number> = {};

  // Cow: Fat 3.0 to 5.5 step 0.1, SNF 7.5 to 9.5 step 0.1
  for (let f = 30; f <= 55; f += 1) {
    const fatVal = f / 10;
    for (let s = 75; s <= 95; s += 1) {
      const snfVal = s / 10;
      const fatDiff = Math.round((fatVal - DEFAULT_FORMULA_SETTINGS.cowBaseFat) * 10);
      const snfDiff = Math.round((snfVal - DEFAULT_FORMULA_SETTINGS.cowBaseSnf) * 10);
      const rate = DEFAULT_FORMULA_SETTINGS.cowBaseRate + 
        (fatDiff * DEFAULT_FORMULA_SETTINGS.cowFatIncrement) + 
        (snfDiff * DEFAULT_FORMULA_SETTINGS.cowSnfIncrement);
      grid[`cow_${fatVal.toFixed(1)}_${snfVal.toFixed(1)}`] = Math.max(15, Math.round(rate * 100) / 100);
    }
  }

  // Buffalo: Fat 5.0 to 10.0 step 0.1, SNF 8.0 to 10.0 step 0.1
  for (let f = 50; f <= 100; f += 1) {
    const fatVal = f / 10;
    for (let s = 80; s <= 100; s += 1) {
      const snfVal = s / 10;
      const fatDiff = Math.round((fatVal - DEFAULT_FORMULA_SETTINGS.buffaloBaseFat) * 10);
      const snfDiff = Math.round((snfVal - DEFAULT_FORMULA_SETTINGS.buffaloBaseSnf) * 10);
      const rate = DEFAULT_FORMULA_SETTINGS.buffaloBaseRate + 
        (fatDiff * DEFAULT_FORMULA_SETTINGS.buffaloFatIncrement) + 
        (snfDiff * DEFAULT_FORMULA_SETTINGS.buffaloSnfIncrement);
      grid[`buffalo_${fatVal.toFixed(1)}_${snfVal.toFixed(1)}`] = Math.max(25, Math.round(rate * 100) / 100);
    }
  }

  // Mix: Fat 3.5 to 7.0, SNF 8.0 to 9.5
  for (let f = 35; f <= 70; f += 1) {
    const fatVal = f / 10;
    for (let s = 80; s <= 95; s += 1) {
      const snfVal = s / 10;
      const rate = 45.0 + ((fatVal - 4.5) * 4.5) + ((snfVal - 8.5) * 3.5);
      grid[`mix_${fatVal.toFixed(1)}_${snfVal.toFixed(1)}`] = Math.max(20, Math.round(rate * 100) / 100);
    }
  }

  return grid;
}

export const INITIAL_RATE_CONFIG: RateConfig = {
  source: 'preset',
  lastUpdated: new Date().toISOString(),
  formulaSettings: DEFAULT_FORMULA_SETTINGS,
  customGrid: generateDefaultRateGrid(),
};

/**
 * Calculate rate for given milk type, fat, and snf.
 */
export function calculateMilkRate(
  milkType: MilkType,
  fat: number,
  snf: number,
  config: RateConfig = INITIAL_RATE_CONFIG
): number {
  if (fat <= 0 || snf <= 0) return 0;

  const fatKey = fat.toFixed(1);
  const snfKey = snf.toFixed(1);
  const key = `${milkType}_${fatKey}_${snfKey}`;

  // 1. Direct grid match if exists
  if (config.customGrid && config.customGrid[key] !== undefined) {
    return config.customGrid[key];
  }

  // 2. Formula fallback if outside grid or not found
  const s = config.formulaSettings || DEFAULT_FORMULA_SETTINGS;
  if (milkType === 'cow') {
    const fatDiff = (fat - s.cowBaseFat) * 10;
    const snfDiff = (snf - s.cowBaseSnf) * 10;
    const rate = s.cowBaseRate + (fatDiff * s.cowFatIncrement) + (snfDiff * s.cowSnfIncrement);
    return Math.max(10, Math.round(rate * 100) / 100);
  } else if (milkType === 'buffalo') {
    const fatDiff = (fat - s.buffaloBaseFat) * 10;
    const snfDiff = (snf - s.buffaloBaseSnf) * 10;
    const rate = s.buffaloBaseRate + (fatDiff * s.buffaloFatIncrement) + (snfDiff * s.buffaloSnfIncrement);
    return Math.max(15, Math.round(rate * 100) / 100);
  } else {
    // Mix
    const base = 48.0;
    const rate = base + ((fat - 4.5) * 5.0) + ((snf - 8.5) * 3.8);
    return Math.max(15, Math.round(rate * 100) / 100);
  }
}

/**
 * Standard ISI Lactometer formula for SNF calculation from CLR:
 * SNF = (CLR / 4) + (0.21 * Fat) + 0.36
 */
export function calculateSnfFromClr(clr: number, fat: number): number {
  if (clr <= 0) return 0;
  const snf = (clr / 4) + (0.21 * fat) + 0.36;
  return Math.round(snf * 100) / 100;
}

/**
 * Parses user-uploaded Excel (.xlsx / .xls / .csv) file
 */
export async function parseExcelRateChart(file: File): Promise<{
  grid: Record<string, number>;
  totalEntries: number;
  fileName: string;
}> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const grid: Record<string, number> = {};
  let totalEntries = 0;

  for (const sheetName of workbook.SheetNames) {
    const lowerName = sheetName.toLowerCase();
    let milkType: MilkType = 'cow';
    if (lowerName.includes('buff') || lowerName.includes('bhains') || lowerName.includes('b')) {
      milkType = 'buffalo';
    } else if (lowerName.includes('mix') || lowerName.includes('mishrit')) {
      milkType = 'mix';
    }

    const worksheet = workbook.Sheets[sheetName];
    const jsonRows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (!jsonRows || jsonRows.length < 2) continue;

    // Check if Format A: Matrix table (Row 0 is SNF values, Column 0 is Fat values)
    const headerRow = jsonRows[0];
    const isMatrix = headerRow.some((col: any) => typeof col === 'number' || (typeof col === 'string' && !isNaN(parseFloat(col)) && parseFloat(col) >= 6.0));

    if (isMatrix) {
      // Find columns that represent SNF (e.g. 7.5, 7.6 ... 10.0)
      const snfCols: { colIndex: number; snf: number }[] = [];
      for (let c = 1; c < headerRow.length; c++) {
        const val = parseFloat(String(headerRow[c]));
        if (!isNaN(val) && val >= 5.0 && val <= 12.0) {
          snfCols.push({ colIndex: c, snf: val });
        }
      }

      for (let r = 1; r < jsonRows.length; r++) {
        const row = jsonRows[r];
        if (!row || row.length === 0) continue;
        const fat = parseFloat(String(row[0]));
        if (isNaN(fat) || fat < 2.0 || fat > 15.0) continue;

        for (const snfCol of snfCols) {
          const rate = parseFloat(String(row[snfCol.colIndex]));
          if (!isNaN(rate) && rate > 0) {
            const key = `${milkType}_${fat.toFixed(1)}_${snfCol.snf.toFixed(1)}`;
            grid[key] = Math.round(rate * 100) / 100;
            totalEntries++;
          }
        }
      }
    } else {
      // Format B: Tabular list (Columns might be: MilkType, Fat, SNF, Rate or Fat, SNF, Rate)
      for (let r = 1; r < jsonRows.length; r++) {
        const row = jsonRows[r];
        if (!row || row.length < 3) continue;

        let rowMilkType = milkType;
        let fatIndex = 0;
        let snfIndex = 1;
        let rateIndex = 2;

        if (row.length >= 4) {
          const firstVal = String(row[0]).toLowerCase();
          if (firstVal.includes('buff') || firstVal.includes('b')) rowMilkType = 'buffalo';
          else if (firstVal.includes('cow') || firstVal.includes('c') || firstVal.includes('g')) rowMilkType = 'cow';
          else if (firstVal.includes('mix')) rowMilkType = 'mix';
          fatIndex = 1;
          snfIndex = 2;
          rateIndex = 3;
        }

        const fat = parseFloat(String(row[fatIndex]));
        const snf = parseFloat(String(row[snfIndex]));
        const rate = parseFloat(String(row[rateIndex]));

        if (!isNaN(fat) && !isNaN(snf) && !isNaN(rate) && rate > 0) {
          const key = `${rowMilkType}_${fat.toFixed(1)}_${snf.toFixed(1)}`;
          grid[key] = Math.round(rate * 100) / 100;
          totalEntries++;
        }
      }
    }
  }

  if (totalEntries === 0) {
    throw new Error('No valid rate data rows could be parsed from the provided file.');
  }

  return {
    grid,
    totalEntries,
    fileName: file.name
  };
}

/**
 * Generates and downloads a clean, beautifully formatted sample Excel rate chart (.xlsx)
 * with Cow and Buffalo sheets for Hawsapur Mahila Dugdh Ltd.
 */
export function downloadSampleRateTemplate() {
  const wb = XLSX.utils.book_new();

  // 1. Cow Rate Sheet (Fat 3.0 to 5.0, SNF 7.5 to 9.2)
  const cowSnfs = [7.5, 7.8, 8.0, 8.2, 8.5, 8.7, 9.0, 9.2];
  const cowRows: any[][] = [];
  cowRows.push(['Fat \\ SNF', ...cowSnfs.map(s => s.toFixed(1))]);

  for (let f = 30; f <= 50; f += 2) {
    const fat = f / 10;
    const row = [fat.toFixed(1)];
    for (const snf of cowSnfs) {
      const rate = 36.50 + ((fat - 3.5) * 4.5) + ((snf - 8.5) * 3.5);
      row.push(rate.toFixed(2));
    }
    cowRows.push(row);
  }
  const cowSheet = XLSX.utils.aoa_to_sheet(cowRows);
  XLSX.utils.book_append_sheet(wb, cowSheet, 'Cow_Rate_Chart');

  // 2. Buffalo Rate Sheet (Fat 5.0 to 9.0, SNF 8.0 to 9.5)
  const buffSnfs = [8.0, 8.2, 8.5, 8.8, 9.0, 9.2, 9.5];
  const buffRows: any[][] = [];
  buffRows.push(['Fat \\ SNF', ...buffSnfs.map(s => s.toFixed(1))]);

  for (let f = 50; f <= 90; f += 5) {
    const fat = f / 10;
    const row = [fat.toFixed(1)];
    for (const snf of buffSnfs) {
      const rate = 64.00 + ((fat - 6.5) * 6.0) + ((snf - 9.0) * 4.0);
      row.push(rate.toFixed(2));
    }
    buffRows.push(row);
  }
  const buffSheet = XLSX.utils.aoa_to_sheet(buffRows);
  XLSX.utils.book_append_sheet(wb, buffSheet, 'Buffalo_Rate_Chart');

  // Trigger download in browser
  XLSX.writeFile(wb, 'Hawsapur_Mahila_Dugdh_Rate_Template.xlsx');
}
