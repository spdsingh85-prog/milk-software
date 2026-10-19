import React, { useState } from 'react';
import { MilkEntry, Language } from '../types/dairy';
import { t } from '../types/translations';
import { generateSlipMessage, sendViaWhatsApp, sendViaSms, copyMessageToClipboard } from '../utils/messaging';
import { Printer, MessageSquare, Send, Copy, X, Check } from 'lucide-react';

interface ThermalReceiptModalProps {
  entry: MilkEntry;
  language: Language;
  onClose: () => void;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({
  entry,
  language,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    const text = generateSlipMessage(entry, language);
    sendViaWhatsApp(entry.farmerPhone, text);
  };

  const handleSendSms = () => {
    const text = generateSlipMessage(entry, language);
    sendViaSms(entry.farmerPhone, text);
  };

  const handleCopy = async () => {
    const text = generateSlipMessage(entry, language);
    const ok = await copyMessageToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const farmerName = language === 'hi' ? entry.farmerNameHi : entry.farmerNameEn;
  const shiftLabel = entry.shift === 'morning' ? (language === 'hi' ? 'सुबह' : 'MORNING') : (language === 'hi' ? 'शाम' : 'EVENING');
  const milkLabel = entry.milkType === 'cow' ? (language === 'hi' ? 'गाय' : 'COW') : entry.milkType === 'buffalo' ? (language === 'hi' ? 'भैंस' : 'BUFFALO') : (language === 'hi' ? 'मिश्रित' : 'MIX');

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 animate-fade-in backdrop-blur-xs">
      <div className="w-full max-w-sm bg-stone-900 border border-stone-700 rounded-3xl p-4 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-200">
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>{t(language, 'receiptTitle')}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thermal Paper Receipt Body */}
        <div className="flex-1 overflow-y-auto py-3">
          <div
            id="thermal-slip-content"
            className="bg-white text-stone-900 p-4 rounded-xl shadow-inner font-mono text-xs space-y-2.5 border-t-4 border-emerald-600"
          >
            {/* Header */}
            <div className="text-center border-b border-dashed border-stone-400 pb-2.5 space-y-0.5">
              <h2 className="font-extrabold text-sm tracking-tight">
                HAWSAPUR MAHILA DUGDH LTD
              </h2>
              <p className="text-[10px] text-stone-700 font-hindi">
                हौसापुर महिला दुग्ध उत्पादक सहकारी लि.
              </p>
              <p className="text-[9px] text-stone-500">
                Milk Collection Slip · Reg. No: HMDL-2026
              </p>
            </div>

            {/* Meta */}
            <div className="text-[11px] space-y-0.5 border-b border-dashed border-stone-300 pb-2">
              <div className="flex justify-between">
                <span>Date: {entry.date}</span>
                <span className="font-bold">{shiftLabel}</span>
              </div>
              <div className="flex justify-between">
                <span>Receipt: #{entry.entryNo}</span>
                <span>Time: {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex justify-between font-bold pt-1">
                <span>Member: #{entry.farmerCode}</span>
                <span className="truncate max-w-[140px] text-right">{farmerName}</span>
              </div>
              <div className="flex justify-between text-stone-600 text-[10px]">
                <span>Phone:</span>
                <span>{entry.farmerPhone}</span>
              </div>
            </div>

            {/* Test Details Table */}
            <div className="space-y-1 py-1 text-[11px]">
              <div className="flex justify-between">
                <span>Milk Type:</span>
                <span className="font-bold uppercase">{milkLabel}</span>
              </div>
              <div className="flex justify-between text-stone-800">
                <span>Quantity:</span>
                <span className="font-bold text-sm">{entry.quantity.toFixed(1)} LTR</span>
              </div>
              <div className="flex justify-between">
                <span>Fat %:</span>
                <span className="font-bold">{entry.fat.toFixed(1)} %</span>
              </div>
              <div className="flex justify-between">
                <span>SNF %:</span>
                <span className="font-bold">{entry.snf.toFixed(1)} %</span>
              </div>
              {entry.clr && (
                <div className="flex justify-between text-stone-600 text-[10px]">
                  <span>CLR Reading:</span>
                  <span>{entry.clr.toFixed(1)}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-dashed border-stone-300">
                <span>Rate / Liter:</span>
                <span className="font-bold">₹{entry.rate.toFixed(2)}</span>
              </div>
            </div>

            {/* Grand Total Highlight */}
            <div className="border-t-2 border-b-2 border-stone-900 py-2 my-1 flex justify-between items-center text-sm font-black">
              <span>TOTAL AMOUNT:</span>
              <span className="text-base">₹{entry.totalAmount.toFixed(2)}</span>
            </div>

            {/* Footer */}
            <div className="text-center pt-2 space-y-1 text-[9px] text-stone-600 border-t border-dashed border-stone-300">
              <p>{t(language, 'thankYou')}</p>
              {/* Fake barcode */}
              <div className="h-6 flex items-center justify-center gap-[2px] opacity-75 my-1">
                {[2, 1, 3, 1, 4, 1, 2, 3, 1, 2, 1, 3, 2, 4, 1, 2, 1, 3, 2, 1, 4].map((w, idx) => (
                  <div key={idx} style={{ width: `${w}px` }} className="h-full bg-black"></div>
                ))}
              </div>
              <p className="font-mono text-[8px] tracking-widest">
                *HMDL-{entry.entryNo}-{entry.farmerCode}*
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="space-y-2 pt-2 border-t border-stone-800 shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleSendWhatsApp}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 font-bold text-white rounded-xl flex items-center justify-center gap-1.5 text-xs cursor-pointer shadow-md"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleSendSms}
              className="py-2.5 px-3 bg-stone-800 hover:bg-stone-700 font-semibold text-stone-200 rounded-xl border border-stone-700 flex items-center justify-center gap-1.5 text-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-cyan-400" />
              <span>SMS Slip</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrint}
              className="py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl border border-stone-700 flex items-center justify-center gap-1.5 text-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print Thermal</span>
            </button>
            <button
              onClick={handleCopy}
              className="py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl border border-stone-700 flex items-center justify-center gap-1.5 text-xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
