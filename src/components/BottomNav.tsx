import React from 'react';
import { Language } from '../types/dairy';
import { t } from '../types/translations';
import { Droplet, FileText, FileSpreadsheet, Users } from 'lucide-react';

export type TabType = 'collection' | 'summary' | 'rateChart' | 'farmers';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  language,
}) => {
  const tabs = [
    {
      id: 'collection' as TabType,
      labelEn: 'Entry',
      labelHi: 'संकलन',
      icon: Droplet,
    },
    {
      id: 'summary' as TabType,
      labelEn: 'Summary',
      labelHi: 'सारांश',
      icon: FileText,
    },
    {
      id: 'rateChart' as TabType,
      labelEn: 'Rate (Excel)',
      labelHi: 'दर चार्ट',
      icon: FileSpreadsheet,
    },
    {
      id: 'farmers' as TabType,
      labelEn: 'Farmers',
      labelHi: 'किसान',
      icon: Users,
    },
  ];

  return (
    <nav className="h-16 bg-stone-950/95 backdrop-blur-md border-t border-stone-800 shrink-0 grid grid-cols-4 px-1.5 py-1 z-30 select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const label = language === 'hi' ? tab.labelHi : tab.labelEn;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeTab(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl transition-all cursor-pointer relative ${
              isActive
                ? 'text-emerald-400 font-bold'
                : 'text-stone-400 hover:text-stone-200 font-medium'
            }`}
          >
            {isActive && (
              <span className="absolute top-1 w-6 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            )}
            <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-emerald-400' : 'text-stone-400'}`} />
            <span className="text-[10px] tracking-tight truncate max-w-full leading-none">
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
