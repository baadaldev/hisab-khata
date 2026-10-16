// Number and Currency formatters
export const toBnDigit = (num) => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => bnDigits[d]);
};

export const formatTaka = (amount, lang = 'bn') => {
  const val = Number(amount) || 0;
  const formatted = val.toLocaleString('en-IN');
  if (lang === 'bn') {
    return `৳ ${toBnDigit(formatted)}`;
  }
  return `৳ ${formatted}`;
};

// Date Formatters
export const formatDate = (dateStr, lang = 'bn') => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const monthsBn = [
    'জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'
  ];
  const monthsEn = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const mIndex = parseInt(month, 10) - 1;
  const d = parseInt(day, 10);
  const y = parseInt(year, 10);

  if (lang === 'bn') {
    return `${toBnDigit(d)} ${monthsBn[mIndex]}, ${toBnDigit(y)}`;
  }
  return `${d} ${monthsEn[mIndex]}, ${y}`;
};

// LocalStorage Keys
export const STORAGE_KEYS = {
  TRANSACTIONS: 'hisab_khata_transactions_v1',
  DEBTS: 'hisab_khata_debts_v1',
  LANG: 'hisab_khata_lang_v1',
  CUSTOM_CATS: 'hisab_khata_categories_v1',
};

export const loadFromStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
  }
  return defaultValue;
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
};

// Export to JSON Backup
export const downloadBackupJSON = (transactions, debts) => {
  const data = {
    appName: 'HisabKhata',
    version: '1.0',
    exportDate: new Date().toISOString(),
    transactions,
    debts,
  };
  const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", jsonStr);
  dlAnchor.setAttribute("download", `hisab-khata-backup-${new Date().toISOString().slice(0, 10)}.json`);
  dlAnchor.click();
};

// Export to CSV
export const downloadCSV = (transactions, debts, lang = 'bn') => {
  let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // Byte Order Mark for Excel Unicode support

  // 1. Transactions CSV
  csvContent += "=== দৈনিক আয়-ব্যয়ের হিসাব (Transactions) ===\n";
  csvContent += "ID,Type,Amount (BDT),Category,Payment Method,Date,Note\n";
  transactions.forEach((tx) => {
    csvContent += `"${tx.id}","${tx.type}","${tx.amount}","${tx.category}","${tx.method}","${tx.date}","${(tx.note || '').replace(/"/g, '""')}"\n`;
  });

  csvContent += "\n=== ধার-দেনার হিসাব (Debts & Loans) ===\n";
  csvContent += "ID,Type,Person,Phone,Original Amount,Paid Amount,Remaining Balance,Due Date,Status,Note\n";
  debts.forEach((d) => {
    const paid = (d.repayments || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const remaining = (Number(d.originalAmount) || 0) - paid;
    csvContent += `"${d.id}","${d.type}","${d.person}","${d.phone || ''}","${d.originalAmount}","${paid}","${remaining}","${d.dueDate || ''}","${d.status}","${(d.note || '').replace(/"/g, '""')}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `hisab-khata-report-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// WhatsApp Reminder Generator
export const generateWhatsAppLink = (debt, lang = 'bn') => {
  const paid = (debt.repayments || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const remaining = (Number(debt.originalAmount) || 0) - paid;
  const takaText = lang === 'bn' ? `৳ ${toBnDigit(remaining)}` : `৳ ${remaining}`;

  let message = '';
  if (debt.type === 'receivable') {
    message = lang === 'bn'
      ? `আসসালামু আলাইকুম ${debt.person} ভাই/বন্ধু, আশা করি ভালো আছেন। আপনার কাছে আমার ${takaText} টাকা পাওনা ছিল। সুবিধাজনক সময়ে পাঠিয়ে দিলে অনেক উপকার হতো। ধন্যবাদ!`
      : `Hello ${debt.person}, hope you are doing well. Just a polite reminder that ${takaText} is due for repayment. Whenever convenient, please settle it. Thank you!`;
  } else {
    message = lang === 'bn'
      ? `আসসালামু আলাইকুম ${debt.person} ভাই, আপনার কাছ থেকে নেওয়া ${takaText} টাকার হিসাব আমার কাছে নোট করা আছে। খুব দ্রুত পরিশোধ করার চেষ্টা করছি। ধন্যবাদ!`
      : `Hello ${debt.person}, I have tracked the ${takaText} that I owe you. Working on clearing it as soon as possible. Thank you!`;
  }

  // Sanitize phone number (e.g., 0171... -> 880171...)
  let phone = (debt.phone || '').trim().replace(/[^0-9]/g, '');
  if (phone.startsWith('01')) {
    phone = '88' + phone;
  }

  const encodedMsg = encodeURIComponent(message);
  if (phone) {
    return `https://wa.me/${phone}?text=${encodedMsg}`;
  }
  return `https://wa.me/?text=${encodedMsg}`;
};
