import { Language } from './dairy';

export const translations = {
  en: {
    appName: 'Hawsapur Mahila Dugdh Ltd',
    appSubtitle: 'Dairy Milk Collection System',
    tagline: 'Cooperative Milk Collection & Farmer WhatsApp/SMS Notification',
    
    // Shifts & Milk Types
    morning: 'Morning',
    evening: 'Evening',
    shift: 'Shift',
    cow: 'Cow',
    buffalo: 'Buffalo',
    mix: 'Mix',
    milkType: 'Milk Type',
    
    // Tabs
    tabCollection: 'Collection Entry',
    tabSummary: 'Collection Summary',
    tabRateChart: 'Rate Chart (Excel)',
    tabFarmers: 'Farmers Directory',
    
    // Entry Form
    newEntry: 'New Milk Entry',
    entryNo: 'Entry #',
    selectFarmer: 'Select Farmer / Member',
    searchFarmerPlaceholder: 'Search by Code (e.g. 101) or Name...',
    memberCode: 'Member ID',
    farmerName: 'Farmer Name',
    phone: 'Phone Number',
    quantity: 'Quantity (Liters)',
    fat: 'Fat %',
    snf: 'SNF %',
    clr: 'CLR (Lactometer)',
    useClr: 'Calculate SNF via CLR',
    ratePerLiter: 'Rate / Liter',
    totalPayable: 'Total Payable',
    clear: 'Reset',
    saveEntry: 'Save Entry',
    saveAndWhatsApp: 'Save & Send WhatsApp',
    saveAndSms: 'Save & Send SMS',
    printSlip: 'Print Receipt Slip',
    entrySavedSuccess: 'Milk entry saved successfully!',
    
    // Quick Liters & Fat
    litersHelper: 'Liters',
    minFat: 'Min Fat',
    maxFat: 'Max Fat',
    
    // Summary
    collectionSummary: 'Collection Summary',
    todayCollection: "Today's Milk Collection",
    morningShift: 'Morning Shift',
    eveningShift: 'Evening Shift',
    allEntries: 'All Collections',
    totalMilk: 'Total Milk',
    liters: 'Liters',
    avgFat: 'Avg Fat',
    avgSnf: 'Avg SNF',
    totalAmount: 'Total Amount',
    totalFarmersCount: 'Farmers Served',
    shareSummaryWhatsApp: 'Share Shift Summary on WhatsApp',
    shareSummarySms: 'Share Summary via SMS',
    noEntriesFound: 'No collection records found for this shift/date.',
    filterByDate: 'Filter Date',
    filterByShift: 'Filter Shift',
    allShifts: 'All Shifts',
    viewSlip: 'View Slip',
    
    // Farmer Individual Summary
    farmerSummaryTitle: 'Farmer Passbook & Cycle Summary',
    selectFarmerForSummary: 'Select Farmer to Generate Summary',
    dateRange: 'Period',
    last10Days: '10-Day Payment Cycle',
    todayOnly: 'Today Only',
    totalEntriesCount: 'Entries',
    sendFarmerWhatsApp: 'Send Statement to Farmer via WhatsApp',
    sendFarmerSms: 'Send Statement via SMS',
    
    // Rate Chart & Excel
    rateChartTitle: 'Milk Rate Chart (Fat & SNF Basis)',
    rateChartDesc: 'Rates are calculated strictly based on Fat % and SNF % matrix or formula.',
    excelNotice: 'Excel rate file will be provided later. You can upload it anytime or download the sample template below.',
    uploadExcel: 'Upload Excel Rate Chart (.xlsx / .csv)',
    downloadTemplate: 'Download Sample Excel Template',
    excelImportSuccess: 'Excel Rate Chart imported successfully!',
    excelImportError: 'Failed to import Excel file. Please use the valid format.',
    currentSource: 'Active Rate Source',
    presetRates: 'Default Standard Cooperative Rate Chart',
    excelRates: 'Custom Excel Rate Chart Imported',
    formulaRates: 'Base Formula Mode',
    calculateRateCheck: 'Rate Calculator Tester',
    testedRateResult: 'Computed Rate:',
    perLiter: '/ Ltr',
    gridFatVsSnf: 'Fat × SNF Rate Matrix Table',
    
    // Farmer Directory
    directoryTitle: 'Registered Milk Producer Members',
    addFarmer: 'Add New Farmer',
    editFarmer: 'Edit Member',
    village: 'Village',
    bankAcc: 'Bank A/c',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    saveFarmer: 'Save Member',
    cancel: 'Cancel',
    
    // Messages / Slips
    receiptTitle: 'MILK COLLECTION RECEIPT',
    thankYou: 'Thank you for your milk supply!',
    poweredBy: 'Hawsapur Mahila Dugdh Ltd - Android System',
    copiedToClipboard: 'Message copied to clipboard!',
    whatsappSentNotice: 'Opening WhatsApp with formatted receipt...',
    smsSentNotice: 'Opening Android SMS app with formatted receipt...',
    
    // Device & Frame
    androidView: 'Android Mobile View',
    fullView: 'Tablet / Fullscreen View',
    systemTime: 'Time',
    battery: '100%'
  },
  hi: {
    appName: 'हौसापुर महिला दुग्ध लि.',
    appSubtitle: 'दूध संकलन एवं भुगतान प्रणाली',
    tagline: 'सहकारी दुग्ध संकलन केंद्र - किसान व्हाट्सऐप एवं एसएमएस सूचना',
    
    // Shifts & Milk Types
    morning: 'सुबह (Morning)',
    evening: 'शाम (Evening)',
    shift: 'पारी (Shift)',
    cow: 'गाय (Cow)',
    buffalo: 'भैंस (Buffalo)',
    mix: 'मिश्रित (Mix)',
    milkType: 'दूध प्रकार',
    
    // Tabs
    tabCollection: 'दूध संकलन (Entry)',
    tabSummary: 'संकलन सारांश (Summary)',
    tabRateChart: 'दर तालिका (Excel)',
    tabFarmers: 'किसान सूची (Farmers)',
    
    // Entry Form
    newEntry: 'नया दूध संकलन पर्ची',
    entryNo: 'पर्ची क्र.',
    selectFarmer: 'किसान / सदस्य चुनें',
    searchFarmerPlaceholder: 'कोड (जैसे 101) या नाम से खोजें...',
    memberCode: 'सदस्य कोड',
    farmerName: 'किसान का नाम',
    phone: 'मोबाइल नंबर',
    quantity: 'मात्रा (लीटर)',
    fat: 'फैट % (Fat)',
    snf: 'एस.एन.एफ. % (SNF)',
    clr: 'सी.एल.आर. (लैक्टोमीटर)',
    useClr: 'CLR से SNF निकालें',
    ratePerLiter: 'दर / लीटर (₹)',
    totalPayable: 'कुल भुगतान (₹)',
    clear: 'रीसेट',
    saveEntry: 'पर्ची सेव करें',
    saveAndWhatsApp: 'सेव & व्हाट्सऐप भेजें',
    saveAndSms: 'सेव & SMS भेजें',
    printSlip: 'थर्मल पर्ची प्रिंट करें',
    entrySavedSuccess: 'दूध की प्रविष्टि सफलतापूर्वक दर्ज की गई!',
    
    // Quick Liters & Fat
    litersHelper: 'लीटर',
    minFat: 'न्यूनतम फैट',
    maxFat: 'अधिकतम फैट',
    
    // Summary
    collectionSummary: 'दूध संकलन सारांश',
    todayCollection: 'आज का कुल दूध संकलन',
    morningShift: 'सुबह की पारी',
    eveningShift: 'शाम की पारी',
    allEntries: 'सभी पर्चियां',
    totalMilk: 'कुल दूध',
    liters: 'लीटर',
    avgFat: 'औसत फैट',
    avgSnf: 'औसत SNF',
    totalAmount: 'कुल राशि (₹)',
    totalFarmersCount: 'कुल किसान संख्या',
    shareSummaryWhatsApp: 'पारी सारांश व्हाट्सऐप पर भेजें',
    shareSummarySms: 'सारांश SMS द्वारा भेजें',
    noEntriesFound: 'इस पारी या तारीख में कोई दूध संकलन दर्ज नहीं है।',
    filterByDate: 'तारीख चुनें',
    filterByShift: 'पारी चुनें',
    allShifts: 'सभी पारियां',
    viewSlip: 'पर्ची देखें',
    
    // Farmer Individual Summary
    farmerSummaryTitle: 'किसान पासबुक / 10-दिवसीय भुगतान सारांश',
    selectFarmerForSummary: 'किसान चुनें (सारांश भेजने हेतु)',
    dateRange: 'अवधि',
    last10Days: '10-दिवसीय चक्र (भुगतान)',
    todayOnly: 'केवल आज का',
    totalEntriesCount: 'कुल पर्चियां',
    sendFarmerWhatsApp: 'किसान को व्हाट्सऐप पर पर्ची/हिसाब भेजें',
    sendFarmerSms: 'किसान को SMS द्वारा हिसाब भेजें',
    
    // Rate Chart & Excel
    rateChartTitle: 'दूध दर तालिका (फैट व SNF आधार)',
    rateChartDesc: 'दूध का मूल्य फैट% और SNF% के आधार पर स्वतः गणना किया जाता है।',
    excelNotice: 'दूध की एक्सेल दर तालिका बाद में उपलब्ध कराई जाएगी। आप अपनी एक्सेल (.xlsx) फाइल कभी भी अपलोड कर सकते हैं या नीचे दिया गया सैंपल प्रारूप डाउनलोड करें।',
    uploadExcel: 'एक्सेल दर तालिका अपलोड करें (.xlsx / .csv)',
    downloadTemplate: 'सैंपल एक्सेल दर प्रारूप डाउनलोड करें',
    excelImportSuccess: 'एक्सेल दर तालिका सफलतापूर्वक लागू की गई!',
    excelImportError: 'एक्सेल फाइल पढ़ने में त्रुटि। कृपया सही फॉर्मेट चुनें।',
    currentSource: 'सक्रिय दर प्रणाली',
    presetRates: 'मानक सहकारी दर तालिका (Standard)',
    excelRates: 'कस्टम एक्सेल दर तालिका (लागू)',
    formulaRates: 'फार्मूला आधारित दर प्रणाली',
    calculateRateCheck: 'दर जांच कैलकुलेटर',
    testedRateResult: 'निर्धारित दर:',
    perLiter: '/ लीटर',
    gridFatVsSnf: 'फैट × SNF दर चार्ट ग्रिड',
    
    // Farmer Directory
    directoryTitle: 'पंजीकृत दुग्ध उत्पादक सदस्य',
    addFarmer: 'नया सदस्य जोड़ें',
    editFarmer: 'सदस्य जानकारी बदलें',
    village: 'गाँव',
    bankAcc: 'बैंक खाता',
    status: 'स्थिति',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    saveFarmer: 'सुरक्षित करें',
    cancel: 'रद्द करें',
    
    // Messages / Slips
    receiptTitle: 'दूध संकलन रसीद',
    thankYou: 'दूध आपूर्ति हेतु धन्यवाद!',
    poweredBy: 'हौसापुर महिला दुग्ध लि. - मोबाइल प्रणाली',
    copiedToClipboard: 'संदेश क्लिपबोर्ड पर कॉपी हो गया!',
    whatsappSentNotice: 'व्हाट्सऐप पर रसीद भेजी जा रही है...',
    smsSentNotice: 'SMS ऐप में रसीद खोली जा रही है...',
    
    // Device & Frame
    androidView: 'एंड्रॉयड फोन व्यू',
    fullView: 'टैबलेट / फुल स्क्रीन',
    systemTime: 'समय',
    battery: '100%'
  }
};

export function t(lang: Language, key: keyof typeof translations['en']): string {
  return translations[lang][key] || translations['en'][key] || key;
}
