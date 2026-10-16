export const EXPENSE_CATEGORIES = [
  { id: 'food', nameBn: 'খাবার ও রেস্তোরাঁ', nameEn: 'Food & Dining', icon: 'Utensils', color: '#f97316' },
  { id: 'grocery', nameBn: 'বাজার ও মুদিখানা', nameEn: 'Groceries', icon: 'ShoppingCart', color: '#10b981' },
  { id: 'transport', nameBn: 'যাতায়াত ও ভাড়া', nameEn: 'Transport', icon: 'Car', color: '#3b82f6' },
  { id: 'rent', nameBn: 'মেস / বাসা ভাড়া', nameEn: 'House Rent', icon: 'Home', color: '#8b5cf6' },
  { id: 'bills', nameBn: 'বিল ও রিচার্জ', nameEn: 'Bills & Recharge', icon: 'Zap', color: '#eab308' },
  { id: 'shopping', nameBn: 'কেনাকাটা', nameEn: 'Shopping', icon: 'ShoppingBag', color: '#ec4899' },
  { id: 'health', nameBn: 'স্বাস্থ্য ও ওষুধ', nameEn: 'Health & Medical', icon: 'HeartPulse', color: '#ef4444' },
  { id: 'education', nameBn: 'শিক্ষা ও বই', nameEn: 'Education & Books', icon: 'BookOpen', color: '#06b6d4' },
  { id: 'tea', nameBn: 'চা ও আড্ডা', nameEn: 'Tea & Snacks', icon: 'Coffee', color: '#d97706' },
  { id: 'entertainment', nameBn: 'বিনোদন', nameEn: 'Entertainment', icon: 'Film', color: '#a855f7' },
  { id: 'family', nameBn: 'পরিবার', nameEn: 'Family & Home', icon: 'Users', color: '#14b8a6' },
  { id: 'other', nameBn: 'অন্যান্য খরচ', nameEn: 'Other Expenses', icon: 'MoreHorizontal', color: '#64748b' },
];

export const INCOME_CATEGORIES = [
  { id: 'salary', nameBn: 'চাকরি / বেতন', nameEn: 'Salary', icon: 'Briefcase', color: '#10b981' },
  { id: 'freelance', nameBn: 'ফ্রিল্যান্সিং', nameEn: 'Freelance & Tech', icon: 'Laptop', color: '#3b82f6' },
  { id: 'business', nameBn: 'ব্যবসা / মুনাফা', nameEn: 'Business Profit', icon: 'TrendingUp', color: '#8b5cf6' },
  { id: 'pocket_money', nameBn: 'পকেট মানি', nameEn: 'Pocket Money', icon: 'Wallet', color: '#f59e0b' },
  { id: 'gift', nameBn: 'উপহার', nameEn: 'Gifts & Awards', icon: 'Gift', color: '#ec4899' },
  { id: 'other_income', nameBn: 'অন্যান্য আয়', nameEn: 'Other Income', icon: 'Coins', color: '#64748b' },
];

export const PAYMENT_METHODS = [
  { id: 'cash', nameBn: 'ক্যাশ (নগদ)', nameEn: 'Cash', color: '#10b981' },
  { id: 'bkash', nameBn: 'বিকাশ (bKash)', nameEn: 'bKash', color: '#e2136e' },
  { id: 'nagad', nameBn: 'নগদ (Nagad)', nameEn: 'Nagad', color: '#f7931e' },
  { id: 'rocket', nameBn: 'রকেট (Rocket)', nameEn: 'Rocket', color: '#8c3494' },
  { id: 'bank', nameBn: 'ব্যাংক একাউন্ট', nameEn: 'Bank Transfer', color: '#3b82f6' },
  { id: 'card', nameBn: 'ডেবিট/ক্রেডিট কার্ড', nameEn: 'Card', color: '#6366f1' },
];

export const DEMO_TRANSACTIONS = [
  {
    id: 'tx-1',
    type: 'income',
    amount: 35000,
    category: 'salary',
    method: 'bank',
    date: '2026-10-01',
    note: 'অক্টোবর মাসের বেতন',
  },
  {
    id: 'tx-2',
    type: 'expense',
    amount: 8500,
    category: 'rent',
    method: 'bank',
    date: '2026-10-02',
    note: 'চলতি মাসের মেস ভাড়া',
  },
  {
    id: 'tx-3',
    type: 'expense',
    amount: 3450,
    category: 'grocery',
    method: 'cash',
    date: '2026-10-05',
    note: 'সাপ্তাহিক কাঁচাবাজার ও চাল',
  },
  {
    id: 'tx-4',
    type: 'expense',
    amount: 800,
    category: 'bills',
    method: 'bkash',
    date: '2026-10-06',
    note: 'ওয়াইফাই বিল ও মোবাইল রিচার্জ',
  },
  {
    id: 'tx-5',
    type: 'expense',
    amount: 350,
    category: 'transport',
    method: 'cash',
    date: '2026-10-08',
    note: 'অফিসে যাওয়া-আসার রিকশা ও বাস ভাড়া',
  },
  {
    id: 'tx-6',
    type: 'expense',
    amount: 1200,
    category: 'food',
    method: 'nagad',
    date: '2026-10-10',
    note: 'বন্ধুদের সাথে কাচ্চি ডিনার',
  },
  {
    id: 'tx-7',
    type: 'income',
    amount: 7500,
    category: 'freelance',
    method: 'bkash',
    date: '2026-10-12',
    note: 'ওয়েবসাইট প্রজেক্টের আংশিক পেমেন্ট',
  },
  {
    id: 'tx-8',
    type: 'expense',
    amount: 450,
    category: 'health',
    method: 'cash',
    date: '2026-10-13',
    note: 'ঠান্ডার ওষুধ ও নাপা এক্সটেন্ড',
  },
  {
    id: 'tx-9',
    type: 'expense',
    amount: 180,
    category: 'tea',
    method: 'cash',
    date: '2026-10-15',
    note: 'টংয়ের চা ও বিস্কুট',
  },
  // Previous months demo transactions for comparison chart
  {
    id: 'tx-prev-1',
    type: 'income',
    amount: 35000,
    category: 'salary',
    method: 'bank',
    date: '2026-09-01',
    note: 'সেপ্টেম্বর বেতন',
  },
  {
    id: 'tx-prev-2',
    type: 'expense',
    amount: 18400,
    category: 'rent',
    method: 'bank',
    date: '2026-09-05',
    note: 'সেপ্টেম্বর খরচাদি',
  },
  {
    id: 'tx-prev-3',
    type: 'income',
    amount: 32000,
    category: 'salary',
    method: 'bank',
    date: '2026-08-01',
    note: 'আগস্ট বেতন',
  },
  {
    id: 'tx-prev-4',
    type: 'expense',
    amount: 21500,
    category: 'shopping',
    method: 'card',
    date: '2026-08-15',
    note: 'ঈদ শপিং ও ব্যক্তিগত খরচ',
  },
  {
    id: 'tx-prev-5',
    type: 'expense',
    amount: 16800,
    category: 'grocery',
    method: 'cash',
    date: '2026-07-10',
    note: 'জুলাই মাসের মোট খরচ',
  },
  {
    id: 'tx-prev-6',
    type: 'income',
    amount: 30000,
    category: 'salary',
    method: 'bank',
    date: '2026-07-01',
    note: 'জুলাই বেতন',
  },
];

export const DEMO_DEBTS = [
  {
    id: 'debt-1',
    type: 'receivable', // আমি পাবো ( ধার দিয়েছি )
    person: 'সাকিব হাসান',
    phone: '01711000000',
    originalAmount: 5000,
    dueDate: '2026-10-25',
    note: 'জরুরি প্রয়োজনে ধার নিয়েছিল',
    repayments: [
      { id: 'rep-1', amount: 2000, date: '2026-10-10', note: 'বিকাশে ফেরত দিল' }
    ],
    status: 'active', // active or settled
    createdAt: '2026-10-01',
  },
  {
    id: 'debt-2',
    type: 'receivable', // আমি পাবো
    person: 'তানভীর আহমেদ',
    phone: '01819000000',
    originalAmount: 1500,
    dueDate: '2026-10-30',
    note: 'রেস্তোরাঁর বিল শেয়ারিং',
    repayments: [],
    status: 'active',
    createdAt: '2026-10-08',
  },
  {
    id: 'debt-3',
    type: 'payable', // আমি দেবো ( ধার নিয়েছি )
    person: 'মাহমুদ ভাই (দোকান)',
    phone: '01912000000',
    originalAmount: 2400,
    dueDate: '2026-10-20',
    note: 'মুদি দোকানের বাকি হিসাব',
    repayments: [
      { id: 'rep-2', amount: 1000, date: '2026-10-14', note: 'ক্যাশে দিয়েছি' }
    ],
    status: 'active',
    createdAt: '2026-10-05',
  },
  {
    id: 'debt-4',
    type: 'receivable',
    person: 'রাকিবুল ইসলাম',
    phone: '01611000000',
    originalAmount: 3000,
    dueDate: '2026-09-30',
    note: 'টিউশন ফি পাওয়ার পর পরিশোধ করবে বলেছিল',
    repayments: [
      { id: 'rep-3', amount: 3000, date: '2026-10-02', note: 'পুরো টাকা দিয়ে দিয়েছে' }
    ],
    status: 'settled',
    createdAt: '2026-09-15',
  }
];

export const MONTH_NAMES_BN = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

export const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
