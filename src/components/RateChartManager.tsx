import React, { useState, useRef } from 'react';
import { RateConfig, MilkType, Language } from '../types/dairy';
import { t } from '../types/translations';
import { 
  calculateMilkRate, 
  parseExcelRateChart, 
  downloadSampleRateTemplate, 
  INITIAL_RATE_CONFIG 
} from '../utils/rateEngine';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  RotateCcw, 
  Grid, 
  Calculator, 
  Info,
  Sparkles
} from 'lucide-react';

interface RateChartManagerProps {
  rateConfig: RateConfig;
  onUpdateRateConfig: (config: RateConfig) => void;
  language: Language;
}

export const RateChartManager: React.FC<RateChartManagerProps> = ({
  rateConfig,
  onUpdateRateConfig,
  language,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Rate tester state
  const [testMilkType, setTestMilkType] = useState<MilkType>('cow');
  const [testFat, setTestFat] = useState<number>(4.0);
  const [testSnf, setTestSnf] = useState<number>(8.5);

  // Matrix view filters
  const [viewMilkType, setViewMilkType] = useState<MilkType>('cow');

  const computedRate = calculateMilkRate(testMilkType, testFat, testSnf, rateConfig);

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const parsed = await parseExcelRateChart(file);
      const newConfig: RateConfig = {
        source: 'excel_imported',
        lastUpdated: new Date().toISOString(),
        importedFileName: parsed.fileName,
        customGrid: parsed.grid,
      };

      onUpdateRateConfig(newConfig);
      setUploadStatus({
        type: 'success',
        message: language === 'hi'
          ? `एक्सेल फाइल (${parsed.fileName}) से ${parsed.totalEntries} दरें सफलतापूर्वक लोड हुईं!`
          : `Successfully imported ${parsed.totalEntries} rate values from ${parsed.fileName}!`,
      });
    } catch (err: any) {
      console.error(err);
      setUploadStatus({
        type: 'error',
        message: err.message || t(language, 'excelImportError'),
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleResetToDefault = () => {
    onUpdateRateConfig(INITIAL_RATE_CONFIG);
    setUploadStatus({
      type: 'success',
      message: language === 'hi' ? 'मानक दर तालिका पुनः लागू की गई।' : 'Reset to default standard rate chart.',
    });
  };

  // Sample grid data for visual display
  const snfHeaders = viewMilkType === 'buffalo' 
    ? [8.0, 8.2, 8.5, 8.8, 9.0, 9.2, 9.5]
    : [7.5, 7.8, 8.0, 8.2, 8.5, 8.8, 9.0];

  const fatRows = viewMilkType === 'buffalo'
    ? [5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0]
    : [3.2, 3.5, 3.8, 4.0, 4.2, 4.5, 4.8, 5.0];

  return (
    <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 pb-20">
      {/* 1. Excel File Notice Banner */}
      <div className="bg-amber-950/30 border border-amber-800/60 rounded-2xl p-3 text-xs space-y-2">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-amber-300">
              {language === 'hi' ? 'एक्सेल दर तालिका सूचना' : 'Excel Rate Chart Notice'}
            </h4>
            <p className="text-stone-300 leading-relaxed text-[11px]">
              {t(language, 'excelNotice')}
            </p>
          </div>
        </div>

        {/* Action buttons for Excel */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls, .csv"
            className="hidden"
          />

          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="py-2.5 px-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 text-xs cursor-pointer shadow-md"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploading ? 'Loading...' : 'Upload Excel (.xlsx)'}</span>
          </button>

          <button
            type="button"
            onClick={downloadSampleRateTemplate}
            className="py-2.5 px-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold rounded-xl border border-stone-700 flex items-center justify-center gap-1.5 text-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Download Sample</span>
          </button>
        </div>

        {uploadStatus && (
          <div
            className={`p-2 rounded-lg text-[11px] flex items-center gap-2 ${
              uploadStatus.type === 'success'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                : 'bg-red-950/80 text-red-300 border border-red-800'
            }`}
          >
            {uploadStatus.type === 'success' ? (
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>{uploadStatus.message}</span>
          </div>
        )}
      </div>

      {/* 2. Current Rate Status Badge */}
      <div className="bg-stone-850 rounded-2xl p-3 border border-stone-700/80 shadow-md flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
            {t(language, 'currentSource')}
          </span>
          <div className="text-xs font-bold text-stone-100 flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              {rateConfig.source === 'excel_imported'
                ? `${t(language, 'excelRates')} (${rateConfig.importedFileName || 'Custom'})`
                : t(language, 'presetRates')}
            </span>
          </div>
        </div>

        {rateConfig.source === 'excel_imported' && (
          <button
            onClick={handleResetToDefault}
            className="text-[11px] text-amber-400 hover:text-amber-300 px-2 py-1 bg-stone-800 rounded-lg border border-stone-700 cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Default</span>
          </button>
        )}
      </div>

      {/* 3. Interactive Rate Calculator Tester */}
      <div className="bg-stone-850 rounded-2xl p-3.5 border border-stone-700/80 shadow-md space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
          <Calculator className="w-4 h-4" />
          <span>{t(language, 'calculateRateCheck')}</span>
        </div>

        {/* Milk type picker */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setTestMilkType('cow')}
            className={`py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              testMilkType === 'cow'
                ? 'bg-amber-950 text-amber-200 border-amber-500'
                : 'bg-stone-900 text-stone-400 border-stone-800'
            }`}
          >
            🐄 {t(language, 'cow')}
          </button>
          <button
            type="button"
            onClick={() => setTestMilkType('buffalo')}
            className={`py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              testMilkType === 'buffalo'
                ? 'bg-indigo-950 text-indigo-200 border-indigo-500'
                : 'bg-stone-900 text-stone-400 border-stone-800'
            }`}
          >
            🐃 {t(language, 'buffalo')}
          </button>
        </div>

        {/* Fat & SNF sliders */}
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-[11px] text-stone-300 mb-1">
              <span>Fat %: <strong>{testFat.toFixed(1)}%</strong></span>
              <span className="text-stone-500">{testMilkType === 'cow' ? '3.0 - 6.0' : '5.0 - 10.0'}</span>
            </div>
            <input
              type="range"
              min={testMilkType === 'cow' ? '3.0' : '5.0'}
              max={testMilkType === 'cow' ? '6.0' : '10.0'}
              step="0.1"
              value={testFat}
              onChange={(e) => setTestFat(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-stone-300 mb-1">
              <span>SNF %: <strong>{testSnf.toFixed(1)}%</strong></span>
              <span className="text-stone-500">7.5 - 10.0</span>
            </div>
            <input
              type="range"
              min="7.5"
              max="10.0"
              step="0.1"
              value={testSnf}
              onChange={(e) => setTestSnf(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Calculated result box */}
        <div className="bg-stone-900 p-2.5 rounded-xl border border-stone-700/80 flex items-center justify-between">
          <span className="text-xs text-stone-300">{t(language, 'testedRateResult')}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-amber-300 font-mono-numbers">
              ₹{computedRate.toFixed(2)}
            </span>
            <span className="text-xs text-stone-400">{t(language, 'perLiter')}</span>
          </div>
        </div>
      </div>

      {/* 4. Fat × SNF 2D Matrix Table Preview */}
      <div className="bg-stone-850 rounded-2xl p-3 border border-stone-700/80 shadow-md space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-200">
            <Grid className="w-4 h-4 text-cyan-400" />
            <span>{t(language, 'gridFatVsSnf')}</span>
          </div>
          <div className="flex items-center gap-1 bg-stone-900 p-0.5 rounded-lg border border-stone-800 text-xs">
            <button
              onClick={() => setViewMilkType('cow')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer ${
                viewMilkType === 'cow' ? 'bg-stone-800 text-amber-300' : 'text-stone-500'
              }`}
            >
              Cow
            </button>
            <button
              onClick={() => setViewMilkType('buffalo')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer ${
                viewMilkType === 'buffalo' ? 'bg-stone-800 text-indigo-300' : 'text-stone-500'
              }`}
            >
              Buffalo
            </button>
          </div>
        </div>

        {/* 2D Scrollable Table */}
        <div className="overflow-x-auto border border-stone-800 rounded-xl">
          <table className="w-full text-[10px] text-center border-collapse">
            <thead>
              <tr className="bg-stone-900 text-stone-400 font-mono border-b border-stone-800">
                <th className="p-1.5 border-r border-stone-800 font-bold bg-stone-950">Fat \ SNF</th>
                {snfHeaders.map((snf) => (
                  <th key={snf} className="p-1.5 min-w-[38px]">{snf.toFixed(1)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 font-mono-numbers">
              {fatRows.map((fat) => (
                <tr key={fat} className="hover:bg-stone-800/40 transition-colors">
                  <td className="p-1.5 font-bold text-amber-400 bg-stone-900/80 border-r border-stone-800">
                    {fat.toFixed(1)}
                  </td>
                  {snfHeaders.map((snf) => {
                    const rate = calculateMilkRate(viewMilkType, fat, snf, rateConfig);
                    return (
                      <td key={snf} className="p-1.5 text-stone-300 hover:text-emerald-300 hover:font-bold">
                        {rate.toFixed(1)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-stone-500 text-center">
          *Rates in ₹/Liter. Matrix updates automatically when custom Excel chart is uploaded.
        </p>
      </div>
    </div>
  );
};
