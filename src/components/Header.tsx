import React from 'react';
import { Shift, Language } from '../types/dairy';
import { t } from '../types/translations';
import { Sun, Moon, Calendar, Volume2, VolumeX, Globe } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  shift: Shift;
  onShiftChange: (shift: Shift) => void;
  date: string;
  onDateChange: (date: string) => void;
  speechEnabled: boolean;
  onToggleSpeech: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  shift,
  onShiftChange,
  date,
  onDateChange,
  speechEnabled,
  onToggleSpeech,
}) => {
  return (
    <header className="bg-stone-900 border-b border-stone-800 shrink-0">
      {/* Top Brand Banner */}
      <div className="px-3.5 py-2.5 flex items-center justify-between gap-2 bg-gradient-to-r from-emerald-950/80 via-stone-900 to-stone-900 border-b border-stone-800/80">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0 ring-1 ring-emerald-400/30">
            🥛
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-emerald-300 truncate leading-tight tracking-wide">
              {language === 'hi' ? 'हौसापुर महिला दुग्ध लि.' : 'Hawsapur Mahila Dugdh Ltd'}
            </h1>
            <p className="text-[11px] text-stone-400 truncate leading-tight">
              {language === 'hi' ? 'सहकारी दूध संकलन केंद्र (Android)' : 'Milk Collection & Rate System'}
            </p>
          </div>
        </div>

        {/* Right actions: Language toggle + Speech toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onToggleSpeech}
            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
              speechEnabled
                ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                : 'bg-stone-800 text-stone-500 border-stone-700'
            }`}
            title={speechEnabled ? 'Voice announcement on' : 'Voice announcement off'}
            aria-label="Toggle voice"
          >
            {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Bilingual Switcher */}
          <button
            onClick={() => onLanguageChange(language === 'hi' ? 'en' : 'hi')}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-xs font-semibold text-stone-200 transition-colors cursor-pointer shadow-sm"
            title="Toggle Hindi / English language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'hi' ? 'EN' : 'हिंदी'}</span>
          </button>
        </div>
      </div>

      {/* Secondary Bar: Shift Selector & Date */}
      <div className="px-3.5 py-2 flex items-center justify-between gap-2 bg-stone-900/90 text-xs">
        {/* Shift selector pills */}
        <div className="flex items-center gap-1 p-0.5 bg-stone-800 rounded-lg border border-stone-700/80">
          <button
            onClick={() => onShiftChange('morning')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium text-xs transition-all cursor-pointer ${
              shift === 'morning'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-200" />
            <span>{t(language, 'morning')}</span>
          </button>
          <button
            onClick={() => onShiftChange('evening')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium text-xs transition-all cursor-pointer ${
              shift === 'evening'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-indigo-200" />
            <span>{t(language, 'evening')}</span>
          </button>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-1.5 bg-stone-800/80 border border-stone-700/80 rounded-lg px-2 py-1 text-stone-300">
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="bg-transparent text-xs text-stone-200 outline-none cursor-pointer font-mono"
          />
        </div>
      </div>
    </header>
  );
};
