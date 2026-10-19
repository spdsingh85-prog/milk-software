import React, { useState, useMemo } from 'react';
import { MilkEntry, Farmer, Shift, Language } from '../types/dairy';
import { t } from '../types/translations';
import { 
  generateShiftSummaryMessage, 
  generateFarmerSummaryMessage, 
  generateSlipMessage,
  sendViaWhatsApp, 
  sendViaSms, 
  copyMessageToClipboard 
} from '../utils/messaging';
import { 
  FileText, 
  Share2, 
  MessageSquare, 
  Send, 
  Copy, 
  Check, 
  Calendar, 
  User, 
  TrendingUp, 
  Printer, 
  ArrowUpRight,
  Filter
} from 'lucide-react';

interface SummaryReportsProps {
  entries: MilkEntry[];
  farmers: Farmer[];
  date: string;
  shift: Shift;
  language: Language;
  onOpenReceipt: (entry: MilkEntry) => void;
}

export const SummaryReports: React.FC<SummaryReportsProps> = ({
  entries,
  farmers,
  date,
  shift,
  language,
  onOpenReceipt,
}) => {
  const [reportType, setReportType] = useState<'shift' | 'farmer'>('shift');
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(farmers[0]?.id || '');
  const [farmerCycle, setFarmerCycle] = useState<'today' | 'cycle10'>('today');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // 1. Shift entries filter
  const shiftEntries = useMemo(() => {
    return entries.filter((e) => e.date === date && e.shift === shift);
  }, [entries, date, shift]);

  // Aggregate stats for shift
  const shiftStats = useMemo(() => {
    const totalLiters = shiftEntries.reduce((s, e) => s + e.quantity, 0);
    const totalAmount = shiftEntries.reduce((s, e) => s + e.totalAmount, 0);
    const cowLiters = shiftEntries.filter((e) => e.milkType === 'cow').reduce((s, e) => s + e.quantity, 0);
    const buffLiters = shiftEntries.filter((e) => e.milkType === 'buffalo').reduce((s, e) => s + e.quantity, 0);
    const avgFat = totalLiters > 0 ? shiftEntries.reduce((s, e) => s + e.fat * e.quantity, 0) / totalLiters : 0;
    const avgSnf = totalLiters > 0 ? shiftEntries.reduce((s, e) => s + e.snf * e.quantity, 0) / totalLiters : 0;

    return {
      totalLiters,
      totalAmount,
      cowLiters,
      buffLiters,
      avgFat,
      avgSnf,
      count: shiftEntries.length,
    };
  }, [shiftEntries]);

  // 2. Farmer entries filter
  const selectedFarmer = useMemo(() => {
    return farmers.find((f) => f.id === selectedFarmerId) || farmers[0];
  }, [farmers, selectedFarmerId]);

  const farmerEntries = useMemo(() => {
    if (!selectedFarmer) return [];
    if (farmerCycle === 'today') {
      return entries.filter((e) => e.farmerId === selectedFarmer.id && e.date === date);
    } else {
      // 10-day cycle: entries in the last 10 days
      const targetDate = new Date(date);
      const pastDate = new Date(targetDate);
      pastDate.setDate(pastDate.getDate() - 9);

      return entries.filter((e) => {
        if (e.farmerId !== selectedFarmer.id) return false;
        const entryDate = new Date(e.date);
        return entryDate >= pastDate && entryDate <= targetDate;
      });
    }
  }, [entries, selectedFarmer, farmerCycle, date]);

  const farmerStats = useMemo(() => {
    const totalLiters = farmerEntries.reduce((s, e) => s + e.quantity, 0);
    const totalAmount = farmerEntries.reduce((s, e) => s + e.totalAmount, 0);
    const avgFat = totalLiters > 0 ? farmerEntries.reduce((s, e) => s + e.fat * e.quantity, 0) / totalLiters : 0;
    const avgSnf = totalLiters > 0 ? farmerEntries.reduce((s, e) => s + e.snf * e.quantity, 0) / totalLiters : 0;
    const avgRate = totalLiters > 0 ? totalAmount / totalLiters : 0;

    return {
      totalLiters,
      totalAmount,
      avgFat,
      avgSnf,
      avgRate,
      count: farmerEntries.length,
    };
  }, [farmerEntries]);

  // Shift summary sharing
  const handleShareShiftWhatsApp = () => {
    const text = generateShiftSummaryMessage(date, shift, shiftEntries, language);
    sendViaWhatsApp('', text);
  };

  const handleShareShiftSms = () => {
    const text = generateShiftSummaryMessage(date, shift, shiftEntries, language);
    sendViaSms('', text);
  };

  const handleCopyShiftSummary = async () => {
    const text = generateShiftSummaryMessage(date, shift, shiftEntries, language);
    const ok = await copyMessageToClipboard(text);
    if (ok) {
      setCopyFeedback(t(language, 'copiedToClipboard'));
      setTimeout(() => setCopyFeedback(null), 2500);
    }
  };

  // Farmer summary sharing
  const handleShareFarmerWhatsApp = () => {
    if (!selectedFarmer) return;
    const periodLabel = farmerCycle === 'today' ? `${date} (${t(language, 'todayOnly')})` : `${t(language, 'last10Days')} (to ${date})`;
    const name = language === 'hi' ? selectedFarmer.nameHi : selectedFarmer.nameEn;
    const text = generateFarmerSummaryMessage(name, selectedFarmer.code, farmerEntries, periodLabel, language);
    sendViaWhatsApp(selectedFarmer.phone, text);
  };

  const handleShareFarmerSms = () => {
    if (!selectedFarmer) return;
    const periodLabel = farmerCycle === 'today' ? `${date} (${t(language, 'todayOnly')})` : `${t(language, 'last10Days')} (to ${date})`;
    const name = language === 'hi' ? selectedFarmer.nameHi : selectedFarmer.nameEn;
    const text = generateFarmerSummaryMessage(name, selectedFarmer.code, farmerEntries, periodLabel, language);
    sendViaSms(selectedFarmer.phone, text);
  };

  const handleCopyFarmerSummary = async () => {
    if (!selectedFarmer) return;
    const periodLabel = farmerCycle === 'today' ? `${date}` : `${t(language, 'last10Days')}`;
    const name = language === 'hi' ? selectedFarmer.nameHi : selectedFarmer.nameEn;
    const text = generateFarmerSummaryMessage(name, selectedFarmer.code, farmerEntries, periodLabel, language);
    const ok = await copyMessageToClipboard(text);
    if (ok) {
      setCopyFeedback(t(language, 'copiedToClipboard'));
      setTimeout(() => setCopyFeedback(null), 2500);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 pb-20">
      {/* Copy feedback toast */}
      {copyFeedback && (
        <div className="bg-emerald-600 text-white text-xs px-3 py-2 rounded-lg flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-1.5 font-medium">
            <Check className="w-4 h-4" />
            <span>{copyFeedback}</span>
          </div>
        </div>
      )}

      {/* Top Toggle: Shift Summary vs Farmer Summary */}
      <div className="flex items-center p-1 bg-stone-850 rounded-xl border border-stone-700/80">
        <button
          onClick={() => setReportType('shift')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            reportType === 'shift'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          {t(language, 'morningShift')}/{t(language, 'eveningShift')}
        </button>
        <button
          onClick={() => setReportType('farmer')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            reportType === 'farmer'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          {language === 'hi' ? 'किसान हिसाब / SMS / WA' : 'Farmer Summary & SMS/WA'}
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODE 1: SHIFT COLLECTION SUMMARY */}
      {/* ───────────────────────────────────────────────────────────── */}
      {reportType === 'shift' && (
        <div className="space-y-3.5">
          {/* Shift KPI Card */}
          <div className="bg-stone-850 rounded-2xl p-3.5 border border-stone-700/80 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <div>
                <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wider">
                  {date} · {shift === 'morning' ? t(language, 'morning') : t(language, 'evening')}
                </h3>
                <p className="text-[11px] text-stone-400">
                  {shiftStats.count} {t(language, 'totalFarmersCount')}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopyShiftSummary}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 cursor-pointer text-xs"
                  title="Copy shift summary"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Metrics 4-grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-stone-900/80 p-2.5 rounded-xl border border-stone-800">
                <span className="text-[10px] uppercase font-semibold text-cyan-400 tracking-wider">
                  {t(language, 'totalMilk')}
                </span>
                <div className="text-xl font-black text-stone-100 font-mono-numbers">
                  {shiftStats.totalLiters.toFixed(1)}{' '}
                  <span className="text-xs font-normal text-stone-400">LTR</span>
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5">
                  🐄 {shiftStats.cowLiters.toFixed(1)}L · 🐃 {shiftStats.buffLiters.toFixed(1)}L
                </div>
              </div>

              <div className="bg-stone-900/80 p-2.5 rounded-xl border border-stone-800">
                <span className="text-[10px] uppercase font-semibold text-amber-400 tracking-wider">
                  {t(language, 'totalAmount')}
                </span>
                <div className="text-xl font-black text-amber-300 font-mono-numbers">
                  ₹{shiftStats.totalAmount.toFixed(2)}
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5">
                  Avg: ₹{(shiftStats.totalLiters > 0 ? shiftStats.totalAmount / shiftStats.totalLiters : 0).toFixed(2)}/L
                </div>
              </div>

              <div className="bg-stone-900/80 p-2 rounded-xl border border-stone-800">
                <span className="text-[10px] uppercase font-semibold text-amber-300">
                  {t(language, 'avgFat')}
                </span>
                <div className="text-base font-bold text-stone-200 font-mono-numbers">
                  {shiftStats.avgFat.toFixed(2)}%
                </div>
              </div>

              <div className="bg-stone-900/80 p-2 rounded-xl border border-stone-800">
                <span className="text-[10px] uppercase font-semibold text-emerald-300">
                  {t(language, 'avgSnf')}
                </span>
                <div className="text-base font-bold text-stone-200 font-mono-numbers">
                  {shiftStats.avgSnf.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Shift Share Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleShareShiftWhatsApp}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 text-xs cursor-pointer shadow-md"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp Summary</span>
              </button>
              <button
                onClick={handleShareShiftSms}
                className="py-2.5 px-3 bg-stone-800 hover:bg-stone-700 active:scale-[0.99] text-stone-200 font-semibold rounded-xl border border-stone-700 flex items-center justify-center gap-1.5 text-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-cyan-400" />
                <span>SMS Summary</span>
              </button>
            </div>
          </div>

          {/* Individual Entries List for Shift */}
          <div className="bg-stone-850 rounded-2xl p-3.5 border border-stone-700/80 shadow-md">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold text-stone-200">
                {t(language, 'allEntries')} ({shiftEntries.length})
              </h4>
              <span className="text-[11px] text-stone-400 font-mono">
                {date}
              </span>
            </div>

            {shiftEntries.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-500">
                {t(language, 'noEntriesFound')}
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-0.5">
                {shiftEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between gap-2 text-xs hover:border-stone-700 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-emerald-400">
                          #{entry.farmerCode}
                        </span>
                        <span className="font-semibold text-stone-100 truncate">
                          {language === 'hi' ? entry.farmerNameHi : entry.farmerNameEn}
                        </span>
                        <span className="text-[10px] px-1 bg-stone-800 rounded text-stone-400">
                          {entry.milkType === 'cow' ? '🐄' : '🐃'}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5 flex items-center gap-2">
                        <span className="text-cyan-400 font-mono font-semibold">
                          {entry.quantity.toFixed(1)} L
                        </span>
                        <span>·</span>
                        <span>F: {entry.fat.toFixed(1)}%</span>
                        <span>·</span>
                        <span>S: {entry.snf.toFixed(1)}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <div className="font-mono-numbers font-bold text-amber-300">
                          ₹{entry.totalAmount.toFixed(2)}
                        </div>
                        <div className="text-[9px] text-stone-500 font-mono">
                          @₹{entry.rate.toFixed(2)}
                        </div>
                      </div>

                      {/* Instant WhatsApp / SMS for this farmer */}
                      <button
                        onClick={() => {
                          const text = generateSlipMessage(entry, language);
                          sendViaWhatsApp(entry.farmerPhone, text);
                        }}
                        className="p-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 cursor-pointer"
                        title="Send WhatsApp Receipt"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onOpenReceipt(entry)}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 cursor-pointer"
                        title="View & Print Thermal Slip"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODE 2: FARMER INDIVIDUAL SUMMARY (PASSBOOK / 10-DAY CYCLE) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {reportType === 'farmer' && (
        <div className="space-y-3.5">
          {/* Farmer Picker & Period Filter */}
          <div className="bg-stone-850 rounded-2xl p-3.5 border border-stone-700/80 shadow-md space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-400 mb-1.5">
                {t(language, 'selectFarmerForSummary')}
              </label>
              <select
                value={selectedFarmerId}
                onChange={(e) => setSelectedFarmerId(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 outline-none focus:border-emerald-500"
              >
                {farmers.map((f) => (
                  <option key={f.id} value={f.id}>
                    #{f.code} - {language === 'hi' ? f.nameHi : f.nameEn} ({f.phone})
                  </option>
                ))}
              </select>
            </div>

            {/* Cycle Period Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFarmerCycle('today')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                  farmerCycle === 'today'
                    ? 'bg-amber-950 text-amber-200 border-amber-600'
                    : 'bg-stone-900 text-stone-400 border-stone-800 hover:bg-stone-800'
                }`}
              >
                {t(language, 'todayOnly')} ({date})
              </button>
              <button
                onClick={() => setFarmerCycle('cycle10')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                  farmerCycle === 'cycle10'
                    ? 'bg-amber-950 text-amber-200 border-amber-600'
                    : 'bg-stone-900 text-stone-400 border-stone-800 hover:bg-stone-800'
                }`}
              >
                {t(language, 'last10Days')}
              </button>
            </div>
          </div>

          {/* Farmer Summary Results Card */}
          <div className="bg-stone-850 rounded-2xl p-3.5 border border-stone-700/80 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <div>
                <h4 className="text-sm font-bold text-stone-100">
                  {language === 'hi' ? selectedFarmer?.nameHi : selectedFarmer?.nameEn}
                </h4>
                <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
                  <span className="font-mono text-emerald-400 font-semibold">#{selectedFarmer?.code}</span>
                  <span>·</span>
                  <span>{selectedFarmer?.phone}</span>
                </div>
              </div>
              <button
                onClick={handleCopyFarmerSummary}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 cursor-pointer text-xs"
                title="Copy statement"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-stone-900 p-2.5 rounded-xl border border-stone-800">
                <span className="text-[10px] uppercase font-semibold text-cyan-400">
                  {t(language, 'totalMilk')}
                </span>
                <div className="text-xl font-black text-stone-100 font-mono-numbers">
                  {farmerStats.totalLiters.toFixed(1)} L
                </div>
                <div className="text-[10px] text-stone-500">
                  {farmerStats.count} {t(language, 'totalEntriesCount')}
                </div>
              </div>

              <div className="bg-stone-900 p-2.5 rounded-xl border border-stone-800">
                <span className="text-[10px] uppercase font-semibold text-amber-400">
                  {t(language, 'totalPayable')}
                </span>
                <div className="text-xl font-black text-amber-300 font-mono-numbers">
                  ₹{farmerStats.totalAmount.toFixed(2)}
                </div>
                <div className="text-[10px] text-stone-500">
                  Avg Rate: ₹{farmerStats.avgRate.toFixed(2)}/L
                </div>
              </div>

              <div className="bg-stone-900 p-2 rounded-xl border border-stone-800">
                <span className="text-[10px] uppercase font-semibold text-amber-300">
                  {t(language, 'avgFat')}
                </span>
                <div className="text-sm font-bold text-stone-200 font-mono-numbers">
                  {farmerStats.avgFat.toFixed(2)}%
                </div>
              </div>

              <div className="bg-stone-900 p-2 rounded-xl border border-stone-800">
                <span className="text-[10px] uppercase font-semibold text-emerald-300">
                  {t(language, 'avgSnf')}
                </span>
                <div className="text-sm font-bold text-stone-200 font-mono-numbers">
                  {farmerStats.avgSnf.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Direct WhatsApp & SMS send to this farmer */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleShareFarmerWhatsApp}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs cursor-pointer shadow-md"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>{t(language, 'sendFarmerWhatsApp')}</span>
              </button>

              <button
                type="button"
                onClick={handleShareFarmerSms}
                className="w-full py-2.5 px-3 bg-stone-800 hover:bg-stone-700 active:scale-[0.99] text-stone-200 font-semibold rounded-xl border border-stone-700 flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t(language, 'sendFarmerSms')}</span>
              </button>
            </div>

            {/* Breakdown of farmer's pours */}
            {farmerEntries.length > 0 && (
              <div className="pt-2 border-t border-stone-800">
                <h5 className="text-[11px] font-semibold text-stone-400 mb-1.5">
                  Collection Records Breakdown:
                </h5>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                  {farmerEntries.map((e) => (
                    <div
                      key={e.id}
                      className="p-2 rounded-lg bg-stone-900/60 border border-stone-800/80 flex items-center justify-between text-[11px]"
                    >
                      <div>
                        <span className="font-mono text-stone-300">{e.date}</span>{' '}
                        <span className="text-stone-500">
                          ({e.shift === 'morning' ? 'M' : 'E'})
                        </span>{' '}
                        <span className="text-cyan-300 font-mono">{e.quantity.toFixed(1)}L</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-stone-400 font-mono">F:{e.fat.toFixed(1)} S:{e.snf.toFixed(1)}</span>
                        <span className="font-mono-numbers font-bold text-amber-300">₹{e.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
