import React, { useState, useMemo } from 'react';
import { Farmer, Language, MilkType } from '../types/dairy';
import { t } from '../types/translations';
import { sendViaWhatsApp } from '../utils/messaging';
import { 
  Users, 
  UserPlus, 
  Search, 
  Phone, 
  MessageSquare, 
  Edit3, 
  Check, 
  X, 
  Building2, 
  CreditCard 
} from 'lucide-react';

interface FarmerDirectoryProps {
  farmers: Farmer[];
  onAddFarmer: (farmer: Farmer) => void;
  onUpdateFarmer: (farmer: Farmer) => void;
  language: Language;
}

export const FarmerDirectory: React.FC<FarmerDirectoryProps> = ({
  farmers,
  onAddFarmer,
  onUpdateFarmer,
  language,
}) => {
  const [search, setSearch] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingFarmer, setEditingFarmer] = useState<Farmer | null>(null);

  // Form states
  const [code, setCode] = useState<string>('');
  const [nameEn, setNameEn] = useState<string>('');
  const [nameHi, setNameHi] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [village, setVillage] = useState<string>('Hawsapur');
  const [defaultMilkType, setDefaultMilkType] = useState<MilkType>('buffalo');
  const [bankAccount, setBankAccount] = useState<string>('');

  const filteredFarmers = useMemo(() => {
    if (!search.trim()) return farmers;
    const q = search.toLowerCase();
    return farmers.filter(
      (f) =>
        f.code.toLowerCase().includes(q) ||
        f.nameEn.toLowerCase().includes(q) ||
        f.nameHi.includes(q) ||
        f.phone.includes(q) ||
        f.village.toLowerCase().includes(q)
    );
  }, [farmers, search]);

  const handleOpenAdd = () => {
    // Auto generate next code
    const maxCode = farmers.reduce((max, f) => {
      const num = parseInt(f.code, 10);
      return !isNaN(num) && num > max ? num : max;
    }, 100);

    setCode((maxCode + 1).toString());
    setNameEn('');
    setNameHi('');
    setPhone('');
    setVillage('Hawsapur (हौसापुर)');
    setDefaultMilkType('buffalo');
    setBankAccount('');
    setEditingFarmer(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (farmer: Farmer) => {
    setEditingFarmer(farmer);
    setCode(farmer.code);
    setNameEn(farmer.nameEn);
    setNameHi(farmer.nameHi);
    setPhone(farmer.phone);
    setVillage(farmer.village);
    setDefaultMilkType(farmer.defaultMilkType);
    setBankAccount(farmer.bankAccount || '');
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn.trim() && !nameHi.trim()) return;

    if (editingFarmer) {
      onUpdateFarmer({
        ...editingFarmer,
        code,
        nameEn: nameEn.trim() || nameHi.trim(),
        nameHi: nameHi.trim() || nameEn.trim(),
        phone: phone.trim(),
        village: village.trim(),
        defaultMilkType,
        bankAccount: bankAccount.trim(),
      });
    } else {
      const newFarmer: Farmer = {
        id: `f-${Date.now()}`,
        code: code || String(farmers.length + 101),
        nameEn: nameEn.trim() || nameHi.trim(),
        nameHi: nameHi.trim() || nameEn.trim(),
        phone: phone.trim() || '9876543210',
        village: village.trim() || 'Hawsapur',
        defaultMilkType,
        bankAccount: bankAccount.trim(),
        active: true,
      };
      onAddFarmer(newFarmer);
    }

    setShowAddModal(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 pb-20">
      {/* Top Header & Search */}
      <div className="bg-stone-850 rounded-2xl p-3 border border-stone-700/80 shadow-md space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <Users className="w-4 h-4" />
            <span>{t(language, 'directoryTitle')} ({farmers.length})</span>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-1 text-xs cursor-pointer shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t(language, 'addFarmer')}</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t(language, 'searchFarmerPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-900 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-100 placeholder-stone-500 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Member Cards List */}
      <div className="space-y-2">
        {filteredFarmers.map((farmer) => (
          <div
            key={farmer.id}
            className="p-3 rounded-2xl bg-stone-850 border border-stone-700/80 shadow-sm flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-stone-800 border border-stone-700 flex flex-col items-center justify-center font-mono shrink-0">
                <span className="text-[9px] text-stone-400 leading-none">ID</span>
                <span className="text-xs font-bold text-emerald-400 leading-tight">
                  {farmer.code}
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-stone-100 truncate text-sm">
                    {language === 'hi' ? farmer.nameHi : farmer.nameEn}
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.2 bg-stone-800 rounded text-stone-400">
                    {farmer.defaultMilkType === 'buffalo' ? '🐃 Buffalo' : '🐄 Cow'}
                  </span>
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5 flex items-center gap-2">
                  <span>{farmer.phone}</span>
                  <span>·</span>
                  <span className="truncate">{farmer.village}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* WhatsApp direct chat */}
              <button
                type="button"
                onClick={() => {
                  const greeting = language === 'hi'
                    ? `नमस्ते ${farmer.nameHi} जी, हौसापुर महिला दुग्ध लि. में आपका स्वागत है।`
                    : `Hello ${farmer.nameEn}, greetings from Hawsapur Mahila Dugdh Ltd.`;
                  sendViaWhatsApp(farmer.phone, greeting);
                }}
                className="p-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 cursor-pointer"
                title="Send WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>

              {/* Call link */}
              <a
                href={`tel:${farmer.phone}`}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700"
                title="Call farmer"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>

              {/* Edit button */}
              <button
                type="button"
                onClick={() => handleOpenEdit(farmer)}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 border border-stone-700 cursor-pointer"
                title="Edit details"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Farmer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 animate-fade-in">
          <div className="w-full max-w-sm bg-stone-900 border border-stone-700 rounded-3xl p-4 shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <h3 className="text-sm font-bold text-stone-100">
                {editingFarmer ? t(language, 'editFarmer') : t(language, 'addFarmer')}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-2.5 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-stone-400 mb-1">{t(language, 'memberCode')}</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-stone-100 font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-stone-400 mb-1">{t(language, 'phone')}</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Name (English)</label>
                <input
                  type="text"
                  required
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Sunita Devi"
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-stone-100"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">नाम (हिंदी)</label>
                <input
                  type="text"
                  value={nameHi}
                  onChange={(e) => setNameHi(e.target.value)}
                  placeholder="उदा. सुनीता देवी"
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-400 mb-1">{t(language, 'village')}</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">{t(language, 'milkType')}</label>
                  <select
                    value={defaultMilkType}
                    onChange={(e) => setDefaultMilkType(e.target.value as MilkType)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-stone-100"
                  >
                    <option value="buffalo">🐃 Buffalo</option>
                    <option value="cow">🐄 Cow</option>
                    <option value="mix">🥛 Mix</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">{t(language, 'bankAcc')}</label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="Optional Bank A/c No"
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-stone-100"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl"
                >
                  {t(language, 'cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 font-bold text-white rounded-xl"
                >
                  {t(language, 'saveFarmer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
