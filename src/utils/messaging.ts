import { MilkEntry, Shift, Language } from '../types/dairy';

/**
 * Clean phone number to 10 digits for Indian mobile numbers
 */
export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return digits;
  if (digits.length > 10 && digits.startsWith('91')) return digits.slice(2);
  return digits;
}

/**
 * Generates single collection slip text in Hindi or English
 */
export function generateSlipMessage(entry: MilkEntry, lang: Language = 'hi'): string {
  const isHi = lang === 'hi';
  const shiftText = entry.shift === 'morning' ? (isHi ? 'सुबह' : 'Morning') : (isHi ? 'शाम' : 'Evening');
  const milkTypeText = entry.milkType === 'cow' 
    ? (isHi ? 'गाय' : 'Cow') 
    : entry.milkType === 'buffalo' 
      ? (isHi ? 'भैंस' : 'Buffalo') 
      : (isHi ? 'मिश्रित' : 'Mix');

  const farmerName = isHi && entry.farmerNameHi ? entry.farmerNameHi : entry.farmerNameEn;

  if (isHi) {
    return `🥛 *हौसापुर महिला दुग्ध लि.* 🥛
━━━━━━━━━━━━━━━━━━━━
*दूध संकलन पर्ची (रसीद)*
━━━━━━━━━━━━━━━━━━━━
👤 *सदस्य:* ${farmerName} (कोड: #${entry.farmerCode})
📅 *दिनांक:* ${entry.date} (${shiftText})
🐄 *दूध प्रकार:* ${milkTypeText}
📊 *मात्रा:* ${entry.quantity.toFixed(1)} लीटर
🧪 *फैट:* ${entry.fat.toFixed(1)}% | *SNF:* ${entry.snf.toFixed(1)}%
${entry.clr ? `🌡️ *CLR:* ${entry.clr.toFixed(1)}\n` : ''}💰 *दर:* ₹${entry.rate.toFixed(2)}/लीटर
💵 *कुल राशि:* *₹${entry.totalAmount.toFixed(2)}*
━━━━━━━━━━━━━━━━━━━━
दूध आपूर्ति हेतु धन्यवाद!
_हौसापुर महिला दुग्ध लि._`;
  }

  return `🥛 *HAWSAPUR MAHILA DUGDH LTD* 🥛
━━━━━━━━━━━━━━━━━━━━
*MILK COLLECTION RECEIPT*
━━━━━━━━━━━━━━━━━━━━
👤 *Member:* ${farmerName} (Code: #${entry.farmerCode})
📅 *Date:* ${entry.date} (${shiftText})
🐄 *Milk:* ${milkTypeText}
📊 *Quantity:* ${entry.quantity.toFixed(1)} Ltr
🧪 *Fat:* ${entry.fat.toFixed(1)}% | *SNF:* ${entry.snf.toFixed(1)}%
${entry.clr ? `🌡️ *CLR:* ${entry.clr.toFixed(1)}\n` : ''}💰 *Rate:* ₹${entry.rate.toFixed(2)}/Ltr
💵 *Total Amount:* *₹${entry.totalAmount.toFixed(2)}*
━━━━━━━━━━━━━━━━━━━━
Thank you for your milk supply!
_Hawsapur Mahila Dugdh Ltd._`;
}

/**
 * Generates collection summary message for a specific farmer (e.g. today or 10-day cycle)
 */
export function generateFarmerSummaryMessage(
  farmerName: string,
  farmerCode: string,
  entries: MilkEntry[],
  periodLabel: string,
  lang: Language = 'hi'
): string {
  const isHi = lang === 'hi';
  const totalLiters = entries.reduce((sum, e) => sum + e.quantity, 0);
  const totalAmount = entries.reduce((sum, e) => sum + e.totalAmount, 0);
  const avgFat = totalLiters > 0 ? entries.reduce((sum, e) => sum + (e.fat * e.quantity), 0) / totalLiters : 0;
  const avgSnf = totalLiters > 0 ? entries.reduce((sum, e) => sum + (e.snf * e.quantity), 0) / totalLiters : 0;
  const avgRate = totalLiters > 0 ? totalAmount / totalLiters : 0;

  if (isHi) {
    let msg = `🥛 *हौसापुर महिला दुग्ध लि.* 🥛
━━━━━━━━━━━━━━━━━━━━
*किसान दूध संकलन हिसाब सारांश*
━━━━━━━━━━━━━━━━━━━━
👤 *सदस्य:* ${farmerName} (कोड: #${farmerCode})
🗓️ *अवधि:* ${periodLabel}
📋 *कुल पर्चियां:* ${entries.length}

📊 *कुल दूध:* *${totalLiters.toFixed(1)} लीटर*
🧪 *औसत फैट:* ${avgFat.toFixed(2)}%
🧪 *औसत SNF:* ${avgSnf.toFixed(2)}%
💰 *औसत दर:* ₹${avgRate.toFixed(2)}/लीटर
━━━━━━━━━━━━━━━━━━━━
💵 *कुल देय राशि:* *₹${totalAmount.toFixed(2)}*
━━━━━━━━━━━━━━━━━━━━
_हौसापुर महिला दुग्ध लि._`;

    return msg;
  }

  return `🥛 *HAWSAPUR MAHILA DUGDH LTD* 🥛
━━━━━━━━━━━━━━━━━━━━
*FARMER MILK COLLECTION SUMMARY*
━━━━━━━━━━━━━━━━━━━━
👤 *Member:* ${farmerName} (Code: #${farmerCode})
🗓️ *Period:* ${periodLabel}
📋 *Total Records:* ${entries.length}

📊 *Total Milk:* *${totalLiters.toFixed(1)} Liters*
🧪 *Avg Fat:* ${avgFat.toFixed(2)}%
🧪 *Avg SNF:* ${avgSnf.toFixed(2)}%
💰 *Avg Rate:* ₹${avgRate.toFixed(2)}/Ltr
━━━━━━━━━━━━━━━━━━━━
💵 *Total Payable:* *₹${totalAmount.toFixed(2)}*
━━━━━━━━━━━━━━━━━━━━
_Hawsapur Mahila Dugdh Ltd._`;
}

/**
 * Generates society shift collection summary for WhatsApp/SMS
 */
export function generateShiftSummaryMessage(
  date: string,
  shift: Shift,
  entries: MilkEntry[],
  lang: Language = 'hi'
): string {
  const isHi = lang === 'hi';
  const shiftText = shift === 'morning' ? (isHi ? 'सुबह' : 'Morning') : (isHi ? 'शाम' : 'Evening');
  const totalLiters = entries.reduce((sum, e) => sum + e.quantity, 0);
  const totalAmount = entries.reduce((sum, e) => sum + e.totalAmount, 0);
  const cowLiters = entries.filter(e => e.milkType === 'cow').reduce((s, e) => s + e.quantity, 0);
  const buffLiters = entries.filter(e => e.milkType === 'buffalo').reduce((s, e) => s + e.quantity, 0);
  const avgFat = totalLiters > 0 ? entries.reduce((sum, e) => sum + (e.fat * e.quantity), 0) / totalLiters : 0;
  const avgSnf = totalLiters > 0 ? entries.reduce((sum, e) => sum + (e.snf * e.quantity), 0) / totalLiters : 0;

  if (isHi) {
    return `🥛 *हौसापुर महिला दुग्ध लि.* 🥛
━━━━━━━━━━━━━━━━━━━━
*दूध संकलन पारी सारांश (Shift Report)*
━━━━━━━━━━━━━━━━━━━━
📅 *तारीख:* ${date} | *पारी:* ${shiftText}
👥 *कुल किसान संख्या:* ${entries.length}
📊 *कुल दूध संकलन:* *${totalLiters.toFixed(1)} लीटर*
  • गाय का दूध: ${cowLiters.toFixed(1)} लीटर
  • भैंस का दूध: ${buffLiters.toFixed(1)} लीटर
🧪 *औसत फैट:* ${avgFat.toFixed(2)}%
🧪 *औसत SNF:* ${avgSnf.toFixed(2)}%
💵 *कुल भुगतान राशि:* *₹${totalAmount.toFixed(2)}*
━━━━━━━━━━━━━━━━━━━━
_हौसापुर महिला दुग्ध उत्पादक सहकारी लि._`;
  }

  return `🥛 *HAWSAPUR MAHILA DUGDH LTD* 🥛
━━━━━━━━━━━━━━━━━━━━
*MILK COLLECTION SHIFT SUMMARY*
━━━━━━━━━━━━━━━━━━━━
📅 *Date:* ${date} | *Shift:* ${shiftText}
👥 *Total Farmers:* ${entries.length}
📊 *Total Collection:* *${totalLiters.toFixed(1)} Liters*
  • Cow Milk: ${cowLiters.toFixed(1)} Ltr
  • Buffalo Milk: ${buffLiters.toFixed(1)} Ltr
🧪 *Avg Fat:* ${avgFat.toFixed(2)}%
🧪 *Avg SNF:* ${avgSnf.toFixed(2)}%
💵 *Total Amount:* *₹${totalAmount.toFixed(2)}*
━━━━━━━━━━━━━━━━━━━━
_Hawsapur Mahila Dugdh Ltd._`;
}

/**
 * Opens WhatsApp on Android/Web with pre-filled message
 */
export function sendViaWhatsApp(phone: string, text: string) {
  const cleanPhone = formatPhoneNumber(phone);
  const encoded = encodeURIComponent(text);
  const url = cleanPhone ? `https://wa.me/91${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
  
  // Use direct location or safe link
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.click();
}

/**
 * Opens standard Android SMS app with pre-filled number & body
 */
export function sendViaSms(phone: string, text: string) {
  const cleanPhone = formatPhoneNumber(phone);
  // Plain text for SMS (clean bold asterisks for standard SMS readability)
  const cleanText = text.replace(/\*/g, '');
  const encoded = encodeURIComponent(cleanText);
  // Android standard SMS URI syntax
  const url = cleanPhone ? `sms:+91${cleanPhone}?body=${encoded}` : `sms:?body=${encoded}`;
  
  window.location.href = url;
}

/**
 * Copies text to device clipboard
 */
export async function copyMessageToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  } catch (err) {
    console.error('Copy failed', err);
    return false;
  }
}
