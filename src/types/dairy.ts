export type Language = 'en' | 'hi';

export type Shift = 'morning' | 'evening';

export type MilkType = 'cow' | 'buffalo' | 'mix';

export interface Farmer {
  id: string;
  code: string; // e.g. "001", "002"
  nameEn: string;
  nameHi: string;
  phone: string;
  village: string;
  defaultMilkType: MilkType;
  bankAccount?: string;
  ifsc?: string;
  active: boolean;
}

export interface MilkEntry {
  id: string;
  entryNo: number;
  date: string; // YYYY-MM-DD
  shift: Shift;
  farmerId: string;
  farmerCode: string;
  farmerNameEn: string;
  farmerNameHi: string;
  farmerPhone: string;
  milkType: MilkType;
  quantity: number; // in Liters
  fat: number;      // e.g. 4.2
  snf: number;      // e.g. 8.5
  clr?: number;     // lactometer reading, optional e.g. 28.5
  rate: number;     // calculated rate per liter (₹)
  totalAmount: number; // quantity * rate (₹)
  timestamp: number;
}

export interface RateMatrixCell {
  fat: number;
  snf: number;
  rate: number;
}

export interface RateConfig {
  source: 'preset' | 'excel_imported' | 'formula';
  lastUpdated: string;
  importedFileName?: string;
  formulaSettings?: {
    cowBaseRate: number;      // e.g. 35.0
    cowBaseFat: number;       // e.g. 3.5
    cowBaseSnf: number;       // e.g. 8.5
    cowFatIncrement: number;  // ₹ per 0.1 fat
    cowSnfIncrement: number;  // ₹ per 0.1 snf
    buffaloBaseRate: number;  // e.g. 62.0
    buffaloBaseFat: number;   // e.g. 6.5
    buffaloBaseSnf: number;   // e.g. 9.0
    buffaloFatIncrement: number;
    buffaloSnfIncrement: number;
  };
  // Grid lookup maps: key is `${milkType}_${fat.toFixed(1)}_${snf.toFixed(1)}` -> rate
  customGrid?: Record<string, number>;
}
