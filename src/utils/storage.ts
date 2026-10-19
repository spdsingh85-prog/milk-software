import { Farmer, MilkEntry, RateConfig } from '../types/dairy';
import { INITIAL_RATE_CONFIG } from './rateEngine';

const STORAGE_KEYS = {
  FARMERS: 'hmdl_farmers_v1',
  ENTRIES: 'hmdl_entries_v1',
  RATE_CONFIG: 'hmdl_rate_config_v1',
  LANGUAGE: 'hmdl_language_v1',
};

export const INITIAL_FARMERS: Farmer[] = [
  {
    id: 'f-101',
    code: '101',
    nameEn: 'Sunita Devi',
    nameHi: 'सुनीता देवी',
    phone: '9876543210',
    village: 'Hawsapur (हौसापुर)',
    defaultMilkType: 'buffalo',
    bankAccount: '•••• 4589',
    ifsc: 'PUNB0123400',
    active: true,
  },
  {
    id: 'f-102',
    code: '102',
    nameEn: 'Kamlesh Kumari',
    nameHi: 'कमलेश कुमारी',
    phone: '9871122334',
    village: 'Hawsapur (हौसापुर)',
    defaultMilkType: 'cow',
    bankAccount: '•••• 7812',
    ifsc: 'SBIN0004521',
    active: true,
  },
  {
    id: 'f-103',
    code: '103',
    nameEn: 'Anita Singh',
    nameHi: 'अनीता सिंह',
    phone: '9810987654',
    village: 'Hawsapur Uttar Tola',
    defaultMilkType: 'buffalo',
    bankAccount: '•••• 3390',
    ifsc: 'BARB0HAWSA',
    active: true,
  },
  {
    id: 'f-104',
    code: '104',
    nameEn: 'Geeta Devi',
    nameHi: 'गीता देवी',
    phone: '9765432109',
    village: 'Hawsapur (हौसापुर)',
    defaultMilkType: 'cow',
    bankAccount: '•••• 9102',
    ifsc: 'SBIN0004521',
    active: true,
  },
  {
    id: 'f-105',
    code: '105',
    nameEn: 'Meena Patel',
    nameHi: 'मीना पटेल',
    phone: '9988776655',
    village: 'Hawsapur Purva',
    defaultMilkType: 'buffalo',
    bankAccount: '•••• 6674',
    ifsc: 'PUNB0123400',
    active: true,
  },
  {
    id: 'f-106',
    code: '106',
    nameEn: 'Savitri Devi',
    nameHi: 'सावित्री देवी',
    phone: '9822334455',
    village: 'Hawsapur (हौसापुर)',
    defaultMilkType: 'cow',
    bankAccount: '•••• 2011',
    ifsc: 'UBIN0543210',
    active: true,
  },
  {
    id: 'f-107',
    code: '107',
    nameEn: 'Rajpatiya Yadav',
    nameHi: 'राजपतिया यादव',
    phone: '9711554433',
    village: 'Hawsapur Dakhin',
    defaultMilkType: 'buffalo',
    bankAccount: '•••• 8829',
    ifsc: 'BARB0HAWSA',
    active: true,
  },
  {
    id: 'f-108',
    code: '108',
    nameEn: 'Munni Devi',
    nameHi: 'मुन्नी देवी',
    phone: '9833445566',
    village: 'Hawsapur (हौसापुर)',
    defaultMilkType: 'mix',
    bankAccount: '•••• 1450',
    ifsc: 'SBIN0004521',
    active: true,
  },
];

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getInitialEntries(): MilkEntry[] {
  const today = getTodayDateString();
  return [
    {
      id: 'entry-1',
      entryNo: 1,
      date: today,
      shift: 'morning',
      farmerId: 'f-101',
      farmerCode: '101',
      farmerNameEn: 'Sunita Devi',
      farmerNameHi: 'सुनीता देवी',
      farmerPhone: '9876543210',
      milkType: 'buffalo',
      quantity: 6.5,
      fat: 6.8,
      snf: 9.1,
      clr: 29.5,
      rate: 66.20,
      totalAmount: 430.30,
      timestamp: Date.now() - 3600000 * 3,
    },
    {
      id: 'entry-2',
      entryNo: 2,
      date: today,
      shift: 'morning',
      farmerId: 'f-102',
      farmerCode: '102',
      farmerNameEn: 'Kamlesh Kumari',
      farmerNameHi: 'कमलेश कुमारी',
      farmerPhone: '9871122334',
      milkType: 'cow',
      quantity: 8.2,
      fat: 4.1,
      snf: 8.6,
      clr: 28.0,
      rate: 39.55,
      totalAmount: 324.31,
      timestamp: Date.now() - 3600000 * 2.5,
    },
    {
      id: 'entry-3',
      entryNo: 3,
      date: today,
      shift: 'morning',
      farmerId: 'f-103',
      farmerCode: '103',
      farmerNameEn: 'Anita Singh',
      farmerNameHi: 'अनीता सिंह',
      farmerPhone: '9810987654',
      milkType: 'buffalo',
      quantity: 5.0,
      fat: 7.2,
      snf: 9.2,
      clr: 30.0,
      rate: 69.00,
      totalAmount: 345.00,
      timestamp: Date.now() - 3600000 * 2,
    },
    {
      id: 'entry-4',
      entryNo: 4,
      date: today,
      shift: 'morning',
      farmerId: 'f-105',
      farmerCode: '105',
      farmerNameEn: 'Meena Patel',
      farmerNameHi: 'मीना पटेल',
      farmerPhone: '9988776655',
      milkType: 'buffalo',
      quantity: 7.4,
      fat: 6.4,
      snf: 8.9,
      clr: 28.8,
      rate: 63.00,
      totalAmount: 466.20,
      timestamp: Date.now() - 3600000 * 1.5,
    },
  ];
}

export function loadFarmers(): Farmer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FARMERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load farmers', e);
  }
  return INITIAL_FARMERS;
}

export function saveFarmers(farmers: Farmer[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.FARMERS, JSON.stringify(farmers));
  } catch (e) {
    console.error('Failed to save farmers', e);
  }
}

export function loadEntries(): MilkEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load entries', e);
  }
  return getInitialEntries();
}

export function saveEntries(entries: MilkEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
  } catch (e) {
    console.error('Failed to save entries', e);
  }
}

export function loadRateConfig(): RateConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RATE_CONFIG);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load rate config', e);
  }
  return INITIAL_RATE_CONFIG;
}

export function saveRateConfig(config: RateConfig) {
  try {
    localStorage.setItem(STORAGE_KEYS.RATE_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save rate config', e);
  }
}
