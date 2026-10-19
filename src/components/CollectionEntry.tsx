import React, { useState, useEffect, useMemo } from 'react';
import { Farmer, MilkEntry, MilkType, Shift, Language, RateConfig } from '../types/dairy';
import { t } from '../types/translations';
import { calculateMilkRate, calculateSnfFromClr } from '../utils/rateEngine';
import { generateSlipMessage, sendViaWhatsApp, sendViaSms, copyMessageToClipboard } from '../utils/messaging';
import { 
  User, 
  Droplet, 
  FlaskConical, 
  Gauge, 
  IndianRupee, 
  MessageSquare, 
  Send, 
  Printer, 
  Check, 
  Plus, 
  Minus,
  Sparkles,
  Phone,
  Copy,
  ChevronRight
} from 'lucide-react';

interface CollectionEntryProps {
  farmers: Farmer[];
  rateConfig: RateConfig;
  shift: Shift;
  date: string;
  language: Language;
  speechEnabled: boolean;
  onSaveEntry: (entry: MilkEntry) => void;
  onOpenReceipt: (entry: MilkEntry) => void;
}

export const CollectionEntry: React.FC<CollectionEntryProps> = ({
  farmers,
  rateConfig,
  shift,
  date,
  language,
  speechEnabled,
  onSaveEntry,
  onOpenReceipt,
}) => {
  // Selection
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFarmerPicker, setShowFarmerPicker] = useState<boolean>(false);

  // Form Fields
  const [milkType, setMilkType] = useState<MilkType>('buffalo');
  const [quantity, setQuantity] = useState<string>('5.0');
  const [fat, setFat] = useState<string>('6.5');
  const [snf, setSnf] = useState<string>('9.0');
  const [useClr, setUseClr] = useState<boolean>(false);
  const [clr, setClr] = useState<string>('29.0');

  // UI state
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Set default farmer on mount if none selected
  useEffect(() => {
    if (!selectedFarmerId && farmers.length > 0) {
      setSelectedFarmerId(farmers[0].id);
      setMilkType(farmers[0].defaultMilkType);
    }
  }, [farmers, selectedFarmerId]);

  const selectedFarmer = useMemo(() => {
    return farmers.find((f) => f.id === selectedFarmerId) || null;
  }, [farmers, selectedFarmerId]);

  // Update milk type default when farmer changes
  const handleSelectFarmer = (farmer: Farmer) => {
    setSelectedFarmerId(farmer.id);
    setMilkType(farmer.defaultMilkType);
    setShowFarmerPicker(false);
    setSearchQuery('');
  };

  // Recalculate SNF when CLR or Fat changes if CLR mode is enabled
  useEffect(() => {
    if (useClr) {
      const c = parseFloat(clr) || 0;
      const f = parseFloat(fat) || 0;
      if (c > 0) {
        const computed = calculateSnfFromClr(c, f);
        setSnf(computed.toFixed(1));
      }
    }
  }, [useClr, clr, fat]);

  // Rate & Amount calculations
  const parsedQty = parseFloat(quantity) || 0;
  const parsedFat = parseFloat(fat) || 0;
  const parsedSnf = parseFloat(snf) || 0;
  const parsedClr = useClr ? (parseFloat(clr) || undefined) : undefined;

  const currentRate = useMemo(() => {
    return calculateMilkRate(milkType, parsedFat, parsedSnf, rateConfig);
  }, [milkType, parsedFat, parsedSnf, rateConfig]);

  const totalAmount = useMemo(() => {
    return Math.round(parsedQty * currentRate * 100) / 100;
  }, [parsedQty, currentRate]);

  // Voice announcement helper
  const speakEntry = (farmerName: string, liters: number, rate: number, total: number) => {
    if (!speechEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      let text = '';
      if (language === 'hi') {
        text = `${farmerName}, ${liters} लीटर दूध, दर ${Math.floor(rate)} रुपये, कुल राशि ${Math.round(total)} रुपये।`;
      } else {
        text = `${farmerName}, ${liters} Liters, Rate ${rate.toFixed(2)} rupees, Total ${Math.round(total)} rupees.`;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error', e);
    }
  };

  // Create entry object
  const buildEntry = (): MilkEntry | null => {
    if (!selectedFarmer || parsedQty <= 0) return null;

    return {
      id: `entry-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      entryNo: Math.floor(Math.random() * 900) + 100,
      date,
      shift,
      farmerId: selectedFarmer.id,
      farmerCode: selectedFarmer.code,
      farmerNameEn: selectedFarmer.nameEn,
      farmerNameHi: selectedFarmer.nameHi,
      farmerPhone: selectedFarmer.phone,
      milkType,
      quantity: parsedQty,
      fat: parsedFat,
      snf: parsedSnf,
      clr: parsedClr,
      rate: currentRate,
      totalAmount,
      timestamp: Date.now(),
    };
  };

  const handleSaveOnly = () => {
    const entry = buildEntry();
    if (!entry) return;

    onSaveEntry(entry);
    const farmerName = language === 'hi' ? entry.farmerNameHi : entry.farmerNameEn;
    speakEntry(farmerName, entry.quantity, entry.rate, entry.totalAmount);
    setSuccessToast(t(language, 'entrySavedSuccess'));
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleSaveAndWhatsApp = () => {
    const entry = buildEntry();
    if (!entry) return;

    onSaveEntry(entry);
    const text = generateSlipMessage(entry, language);
    sendViaWhatsApp(entry.farmerPhone, text);

    const farmerName = language === 'hi' ? entry.farmerNameHi : entry.farmerNameEn;
    speakEntry(farmerName, entry.quantity, entry.rate, entry.totalAmount);
    setSuccessToast(t(language, 'whatsappSentNotice'));
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleSaveAndSms = () => {
    const entry = buildEntry();
    if (!entry) return;

    onSaveEntry(entry);
    const text = generateSlipMessage(entry, language);
    sendViaSms(entry.farmerPhone, text);

    const farmerName = language === 'hi' ? entry.farmerNameHi : entry.farmerNameEn;
    speakEntry(farmerName, entry.quantity, entry.rate, entry.totalAmount);
    setSuccessToast(t(language, 'smsSentNotice'));
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleSaveAndPrint = () => {
    const entry = buildEntry();
    if (!entry) return;

    onSaveEntry(entry);
    onOpenReceipt(entry);
    const farmerName = language === 'hi' ? entry.farmerNameHi : entry.farmerNameEn;
    speakEntry(farmerName, entry.quantity, entry.rate, entry.totalAmount);
  };

  // Stepper helpers
  const adjustQty = (delta: number) => {
    const current = parseFloat(quantity) || 0;
    const next = Math.max(0.1, Math.round((current + delta) * 10) / 10);
    setQuantity(next.toString());
  };

  const adjustFat = (delta: number) => {
    const current = parseFloat(fat) || 0;
    const next = Math.max(2.5, Math.min(13.0, Math.round((current + delta) * 10) / 10));
    setFat(next.toFixed(1));
  };

  const adjustSnf = (delta: number) => {
    const current = parseFloat(snf) || 0;
    const next = Math.max(6.5, Math.min(12.0, Math.round((current + delta) * 10) / 10));
    setSnf(next.toFixed(1));
  };

  // Filtered farmers
  const filteredFarmers = useMemo(() => {
    if (!searchQuery.trim()) return farmers;
    const q = searchQuery.toLowerCase();
    return farmers.filter(
      (f) =>
        f.code.toLowerCase().includes(q) ||
        f.nameEn.toLowerCase().includes(q) ||
        f.nameHi.includes(q) ||
        f.phone.includes(q)
    );
  }, [farmers, searchQuery]);

  return (
    <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 pb-20">
      {/* Toast Notification */}
      {successToast && (
        <div className="bg-emerald-600 text-white text-xs px-3 py-2 rounded-lg flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-1.5 font-medium">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successToast}</span>
          </div>
        </div>
      )}

      {/* 1. Farmer Selection Card */}
      <div className="bg-stone-850 rounded-2xl p-3 border border-stone-700/80 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <User className="w-4 h-4" />
            <span>{t(language, 'selectFarmer')}</span>
          </div>
          <button
            onClick={() => setShowFarmerPicker(!showFarmerPicker)}
            className="text-[11px] text-stone-300 hover:text-white px-2 py-0.5 bg-stone-700/60 rounded-md cursor-pointer border border-stone-600/60"
          >
            {showFarmerPicker ? 'Close' : 'Change Member'}
          </button>
        </div>

        {/* Selected Farmer Info Display */}
        {selectedFarmer && !showFarmerPicker && (
          <div 
            onClick={() => setShowFarmerPicker(true)}
            className="flex items-center justify-between p-2.5 bg-stone-800/90 hover:bg-stone-800 rounded-xl border border-stone-700 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center justify-center text-emerald-400 font-mono shrink-0">
                <span className="text-[9px] uppercase leading-none text-emerald-400/70">ID</span>
                <span className="text-sm font-bold leading-tight">{selectedFarmer.code}</span>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-stone-100 truncate leading-snug">
                  {language === 'hi' ? selectedFarmer.nameHi : selectedFarmer.nameEn}
                </h3>
                <div className="flex items-center gap-2 text-[11px] text-stone-400">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-stone-500" />
                    <span>{selectedFarmer.phone}</span>
                  </span>
                  <span>·</span>
                  <span className="truncate">{selectedFarmer.village}</span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
          </div>
        )}

        {/* Farmer Picker Dropdown / Search Modal */}
        {showFarmerPicker && (
          <div className="mt-2 space-y-2">
            <input
              type="text"
              placeholder={t(language, 'searchFarmerPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
              {filteredFarmers.map((farmer) => (
                <div
                  key={farmer.id}
                  onClick={() => handleSelectFarmer(farmer)}
                  className={`p-2 rounded-lg flex items-center justify-between text-xs cursor-pointer border transition-colors ${
                    selectedFarmerId === farmer.id
                      ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200'
                      : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-8 py-0.5 text-center font-mono font-bold bg-stone-800 rounded text-stone-300 text-[11px]">
                      #{farmer.code}
                    </span>
                    <div>
                      <div className="font-semibold text-stone-100">
                        {language === 'hi' ? farmer.nameHi : farmer.nameEn}
                      </div>
                      <div className="text-[10px] text-stone-400">{farmer.phone}</div>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-stone-400 bg-stone-800 px-1.5 py-0.5 rounded">
                    {farmer.defaultMilkType}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Milk Type Selector */}
      <div className="bg-stone-850 rounded-2xl p-3 border border-stone-700/80 shadow-md">
        <label className="block text-xs font-semibold text-stone-400 mb-2">
          {t(language, 'milkType')}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['buffalo', 'cow', 'mix'] as MilkType[]).map((type) => {
            const isSelected = milkType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setMilkType(type)}
                className={`py-2 px-1 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  isSelected
                    ? type === 'buffalo'
                      ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200 shadow-md ring-1 ring-indigo-500/40'
                      : type === 'cow'
                        ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-md ring-1 ring-amber-500/40'
                        : 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md ring-1 ring-emerald-500/40'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <span className="text-base">
                  {type === 'buffalo' ? '🐃' : type === 'cow' ? '🐄' : '🥛'}
                </span>
                <span>{t(language, type)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Milk Quantity (Liters) Input */}
      <div className="bg-stone-850 rounded-2xl p-3 border border-stone-700/80 shadow-md">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
            <Droplet className="w-4 h-4 text-cyan-400" />
            <span>{t(language, 'quantity')}</span>
          </label>
          <span className="text-[11px] text-stone-400 font-mono">
            {parsedQty.toFixed(1)} {t(language, 'litersHelper')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => adjustQty(-1.0)}
            className="w-11 h-11 rounded-xl bg-stone-800 hover:bg-stone-700 active:scale-95 border border-stone-700 text-stone-200 flex items-center justify-center font-bold text-lg cursor-pointer shrink-0"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="relative flex-1">
            <input
              type="number"
              step="0.1"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-stone-950 text-stone-100 text-center font-mono-numbers font-bold text-2xl py-2 px-3 rounded-xl border border-stone-700 focus:outline-none focus:border-cyan-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-stone-500 pointer-events-none">
              LTR
            </span>
          </div>
          <button
            type="button"
            onClick={() => adjustQty(1.0)}
            className="w-11 h-11 rounded-xl bg-stone-800 hover:bg-stone-700 active:scale-95 border border-stone-700 text-stone-200 flex items-center justify-center font-bold text-lg cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Liters Chips */}
        <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-0.5">
          {[1, 2, 5, 8, 10, 15].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setQuantity(val.toString())}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-colors cursor-pointer shrink-0 ${
                parsedQty === val
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                  : 'bg-stone-900 text-stone-400 border-stone-800 hover:bg-stone-800'
              }`}
            >
              {val}L
            </button>
          ))}
          <button
            type="button"
            onClick={() => adjustQty(0.5)}
            className="px-2 py-1 text-[11px] font-mono rounded-lg bg-stone-800 hover:bg-stone-700 text-cyan-400 border border-stone-700 shrink-0 cursor-pointer"
          >
            +0.5L
          </button>
        </div>
      </div>

      {/* 4. Fat & SNF Controls (Dual Matrix Basis) */}
      <div className="bg-stone-850 rounded-2xl p-3 border border-stone-700/80 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-stone-800 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <FlaskConical className="w-4 h-4" />
            <span>{t(language, 'rateChartTitle')}</span>
          </div>
          {/* CLR toggle switch */}
          <button
            type="button"
            onClick={() => setUseClr(!useClr)}
            className={`text-[11px] font-medium px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
              useClr
                ? 'bg-amber-950 text-amber-300 border-amber-600'
                : 'bg-stone-900 text-stone-400 border-stone-700'
            }`}
          >
            {useClr ? '✓ CLR Mode Active' : '+ Use Lactometer (CLR)'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Fat % */}
          <div className="bg-stone-900/90 p-2.5 rounded-xl border border-stone-800">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1.5">
              <span className="font-semibold text-amber-300">{t(language, 'fat')}</span>
              <span className="font-mono text-[10px] text-stone-500">2.5 - 12.0</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => adjustFat(-0.1)}
                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                step="0.1"
                min="1"
                max="15"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                className="w-full bg-stone-950 text-stone-100 text-center font-mono-numbers font-bold text-lg py-1 px-1 rounded-lg border border-stone-700 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => adjustFat(0.1)}
                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* SNF % */}
          <div className="bg-stone-900/90 p-2.5 rounded-xl border border-stone-800">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1.5">
              <span className="font-semibold text-emerald-300">{t(language, 'snf')}</span>
              <span className="font-mono text-[10px] text-stone-500">
                {useClr ? 'Auto CLR' : '6.5 - 12.0'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={useClr}
                onClick={() => adjustSnf(-0.1)}
                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-200 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                step="0.1"
                min="5"
                max="14"
                disabled={useClr}
                value={snf}
                onChange={(e) => setSnf(e.target.value)}
                className="w-full bg-stone-950 text-stone-100 text-center font-mono-numbers font-bold text-lg py-1 px-1 rounded-lg border border-stone-700 focus:outline-none focus:border-emerald-500 disabled:bg-stone-900 disabled:text-emerald-400"
              />
              <button
                type="button"
                disabled={useClr}
                onClick={() => adjustSnf(0.1)}
                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-200 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Optional CLR input row */}
        {useClr && (
          <div className="bg-amber-950/20 border border-amber-900/50 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-semibold text-stone-200">{t(language, 'clr')}</span>
                <p className="text-[10px] text-stone-400">Formula: (CLR/4) + (0.21×Fat) + 0.36</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 w-28">
              <input
                type="number"
                step="0.5"
                value={clr}
                onChange={(e) => setClr(e.target.value)}
                className="w-full bg-stone-950 text-stone-100 font-mono-numbers font-bold text-center py-1 rounded-lg border border-amber-700/60 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* 5. Live Computed Rate & Total Payable Card */}
      <div className="bg-gradient-to-br from-emerald-950/70 via-stone-900 to-stone-950 rounded-2xl p-3.5 border border-emerald-800/60 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[11px] font-semibold text-emerald-400/90 uppercase tracking-wider mb-0.5">
              {t(language, 'ratePerLiter')}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-stone-300">₹</span>
              <span className="text-3xl font-extrabold text-stone-100 font-mono-numbers">
                {currentRate.toFixed(2)}
              </span>
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5 flex items-center gap-1">
              <span>{rateConfig.source === 'excel_imported' ? 'Excel Chart' : 'Standard Grid'}</span>
              <span>·</span>
              <span>{t(language, milkType)}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] font-semibold text-amber-400/90 uppercase tracking-wider mb-0.5">
              {t(language, 'totalPayable')}
            </div>
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-xl font-bold text-amber-400">₹</span>
              <span className="text-3xl font-black text-amber-300 font-mono-numbers tracking-tight">
                {totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5 font-mono">
              {parsedQty.toFixed(1)}L × ₹{currentRate.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Action Buttons Grid */}
      <div className="space-y-2 pt-1">
        {/* WhatsApp primary action */}
        <button
          type="button"
          onClick={handleSaveAndWhatsApp}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          <span>{t(language, 'saveAndWhatsApp')}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          {/* SMS action */}
          <button
            type="button"
            onClick={handleSaveAndSms}
            className="py-2.5 px-3 bg-stone-800 hover:bg-stone-700 active:scale-[0.99] text-stone-200 font-semibold rounded-xl border border-stone-700 flex items-center justify-center gap-1.5 text-xs transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t(language, 'saveAndSms')}</span>
          </button>

          {/* Thermal print receipt */}
          <button
            type="button"
            onClick={handleSaveAndPrint}
            className="py-2.5 px-3 bg-stone-800 hover:bg-stone-700 active:scale-[0.99] text-stone-200 font-semibold rounded-xl border border-stone-700 flex items-center justify-center gap-1.5 text-xs transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>{t(language, 'printSlip')}</span>
          </button>
        </div>

        {/* Quick silent save */}
        <button
          type="button"
          onClick={handleSaveOnly}
          className="w-full py-2 text-center text-xs text-stone-400 hover:text-stone-200 font-medium cursor-pointer"
        >
          {t(language, 'saveEntry')} (Without WhatsApp/SMS)
        </button>
      </div>
    </div>
  );
};
