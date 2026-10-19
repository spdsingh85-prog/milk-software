/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Shift, Language, MilkEntry, Farmer, RateConfig } from './types/dairy';
import { 
  loadFarmers, 
  saveFarmers, 
  loadEntries, 
  saveEntries, 
  loadRateConfig, 
  saveRateConfig, 
  getTodayDateString 
} from './utils/storage';
import { AndroidFrame } from './components/AndroidFrame';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { CollectionEntry } from './components/CollectionEntry';
import { SummaryReports } from './components/SummaryReports';
import { RateChartManager } from './components/RateChartManager';
import { FarmerDirectory } from './components/FarmerDirectory';
import { ThermalReceiptModal } from './components/ThermalReceiptModal';

export default function App() {
  // Determine initial shift based on current time
  const currentHour = new Date().getHours();
  const initialShift: Shift = currentHour >= 14 ? 'evening' : 'morning';

  // State
  const [language, setLanguage] = useState<Language>('hi');
  const [shift, setShift] = useState<Shift>(initialShift);
  const [date, setDate] = useState<string>(getTodayDateString());
  const [activeTab, setActiveTab] = useState<TabType>('collection');
  const [isFullView, setIsFullView] = useState<boolean>(false);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(false);

  // Core Data
  const [farmers, setFarmers] = useState<Farmer[]>(loadFarmers);
  const [entries, setEntries] = useState<MilkEntry[]>(loadEntries);
  const [rateConfig, setRateConfig] = useState<RateConfig>(loadRateConfig);

  // Receipt Modal State
  const [receiptEntry, setReceiptEntry] = useState<MilkEntry | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveFarmers(farmers);
  }, [farmers]);

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  useEffect(() => {
    saveRateConfig(rateConfig);
  }, [rateConfig]);

  // Handlers
  const handleSaveEntry = (newEntry: MilkEntry) => {
    setEntries((prev) => [newEntry, ...prev]);
  };

  const handleUpdateRateConfig = (newConfig: RateConfig) => {
    setRateConfig(newConfig);
  };

  const handleAddFarmer = (newFarmer: Farmer) => {
    setFarmers((prev) => [...prev, newFarmer]);
  };

  const handleUpdateFarmer = (updated: Farmer) => {
    setFarmers((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  };

  return (
    <AndroidFrame
      activeTab={activeTab}
      isFullView={isFullView}
      onToggleFullView={() => setIsFullView(!isFullView)}
    >
      {/* Top Application Bar */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        shift={shift}
        onShiftChange={setShift}
        date={date}
        onDateChange={setDate}
        speechEnabled={speechEnabled}
        onToggleSpeech={() => setSpeechEnabled(!speechEnabled)}
      />

      {/* Main Content Area Based on Active Tab */}
      <main className="flex-1 overflow-hidden flex flex-col relative bg-stone-900">
        {activeTab === 'collection' && (
          <CollectionEntry
            farmers={farmers}
            rateConfig={rateConfig}
            shift={shift}
            date={date}
            language={language}
            speechEnabled={speechEnabled}
            onSaveEntry={handleSaveEntry}
            onOpenReceipt={(entry) => setReceiptEntry(entry)}
          />
        )}

        {activeTab === 'summary' && (
          <SummaryReports
            entries={entries}
            farmers={farmers}
            date={date}
            shift={shift}
            language={language}
            onOpenReceipt={(entry) => setReceiptEntry(entry)}
          />
        )}

        {activeTab === 'rateChart' && (
          <RateChartManager
            rateConfig={rateConfig}
            onUpdateRateConfig={handleUpdateRateConfig}
            language={language}
          />
        )}

        {activeTab === 'farmers' && (
          <FarmerDirectory
            farmers={farmers}
            onAddFarmer={handleAddFarmer}
            onUpdateFarmer={handleUpdateFarmer}
            language={language}
          />
        )}
      </main>

      {/* Android Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        language={language}
      />

      {/* Thermal Receipt Print Modal */}
      {receiptEntry && (
        <ThermalReceiptModal
          entry={receiptEntry}
          language={language}
          onClose={() => setReceiptEntry(null)}
        />
      )}
    </AndroidFrame>
  );
}
