import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery, Smartphone, Maximize2, Minimize2 } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeTab: string;
  isFullView: boolean;
  onToggleFullView: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  isFullView,
  onToggleFullView,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('08:30');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  if (isFullView) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between">
        <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col p-2 md:p-6">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-800 text-xs text-stone-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Hawsapur Mahila Dugdh Ltd · Live Android Terminal</span>
            </span>
            <button
              onClick={onToggleFullView}
              className="flex items-center gap-1.5 px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-md transition-colors text-xs font-medium cursor-pointer"
            >
              <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Switch to Phone Frame</span>
            </button>
          </div>
          <div className="flex-1 flex flex-col bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden shadow-2xl">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 py-4 px-2 sm:px-4 flex flex-col items-center justify-center">
      {/* Top Controls bar */}
      <div className="w-full max-w-md flex items-center justify-between mb-3 text-xs text-stone-400 px-2">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-stone-300">Android Mobile View</span>
          <span className="text-stone-600">·</span>
          <span className="text-stone-400">Samsung/Redmi Frame</span>
        </div>
        <button
          onClick={onToggleFullView}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-800/80 hover:bg-stone-700 text-stone-300 rounded-md transition-colors text-xs cursor-pointer border border-stone-700"
          title="Switch to tablet / wide counter view"
        >
          <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Full View</span>
        </button>
      </div>

      {/* Android Device Chassis */}
      <div className="relative w-full max-w-[420px] h-[890px] max-h-[95vh] bg-stone-900 rounded-[44px] border-[10px] border-stone-800 shadow-[0_0_50px_rgba(0,0,0,0.8),0_20px_40px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden ring-1 ring-stone-700">
        
        {/* Android Punch Hole Camera Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-stone-950 rounded-full z-50 flex items-center justify-center ring-2 ring-stone-800">
          <div className="w-1.5 h-1.5 bg-blue-900/60 rounded-full"></div>
        </div>

        {/* Android Native Status Bar */}
        <div className="h-8 bg-stone-950/90 text-stone-300 px-5 flex items-center justify-between text-xs font-mono select-none z-40 border-b border-stone-800/40">
          <div className="font-semibold tracking-tight text-[11px] text-stone-200">
            {currentTime}
          </div>
          <div className="flex items-center gap-2.5 text-stone-400">
            <span className="text-[10px] font-bold text-emerald-400 tracking-wider">4G VoLTE</span>
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-1">
              <span className="text-[10px]">98%</span>
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Screen Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-stone-900 text-stone-100">
          {children}
        </div>

        {/* Android System Gesture Navigation Bar */}
        <div className="h-6 bg-stone-950 flex items-center justify-center shrink-0 border-t border-stone-900">
          <div className="w-32 h-1 bg-stone-500/50 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
