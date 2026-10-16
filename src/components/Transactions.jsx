import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS, MONTH_NAMES_BN, MONTH_NAMES_EN } from '../constants/initialData';
import { formatTaka, formatDate, toBnDigit } from '../utils/helpers';
import { CategoryIcon } from './CategoryIcon';

export const Transactions = ({ 
  transactions, 
  onOpenAddModal, 
  onOpenEditModal, 
  onDeleteTransaction, 
  selectedMonth,
  onSelectMonth,
  lang 
}) => {
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'expense' | 'income'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Available months
  const availableMonths = useMemo(() => {
    const set = new Set();
    transactions.forEach(t => {
      if (t.date) set.add(t.date.slice(0, 7));
    });
    const now = new Date().toISOString().slice(0, 7);
    set.add(now);
    return Array.from(set).sort().reverse();
  }, [transactions]);

  // Filtered transactions
  const filtered = useMemo(() => {
    return transactions.filter(t => {
      // Month filter
      if (selectedMonth && (!t.date || !t.date.startsWith(selectedMonth))) {
        return false;
      }
      // Type filter
      if (typeFilter !== 'all' && t.type !== typeFilter) {
        return false;
      }
      // Category filter
      if (categoryFilter !== 'all' && t.category !== categoryFilter) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const noteMatch = (t.note || '').toLowerCase().includes(q);
        const amountMatch = String(t.amount || '').includes(q);
        const catMatch = (t.category || '').toLowerCase().includes(q);
        return noteMatch || amountMatch || catMatch;
      }
      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, selectedMonth, typeFilter, categoryFilter, searchQuery]);

  // Financial summary for filtered
  const { totalInc, totalExp } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    filtered.forEach(t => {
      const amt = Number(t.amount) || 0;
      if (t.type === 'income') inc += amt;
      else if (t.type === 'expense') exp += amt;
    });
    return { totalInc: inc, totalExp: exp };
  }, [filtered]);

  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

  const getCategoryDetails = (catId, type) => {
    const list = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    const found = list.find(c => c.id === catId);
    if (found) return found;
    return {
      id: catId,
      nameBn: catId,
      nameEn: catId,
      icon: 'MoreHorizontal',
      color: '#64748b'
    };
  };

  const getPaymentMethodName = (methodId) => {
    const found = PAYMENT_METHODS.find(m => m.id === methodId);
    if (!found) return methodId;
    return lang === 'bn' ? found.nameBn : found.nameEn;
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Header Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#121827]/90 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{lang === 'bn' ? 'সকল লেনদেনের তালিকা' : 'Transaction History'}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {toBnDigit(filtered.length)} {lang === 'bn' ? 'টি' : 'items'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'bn' ? 'আয় ও ব্যয়ের বিস্তারিত হিসাব ও ফিল্টারিং' : 'Manage income and expense records'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition ${
                showFilters || categoryFilter !== 'all' || typeFilter !== 'all'
                  ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">{lang === 'bn' ? 'ফিল্টার' : 'Filters'}</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-900/30 flex items-center gap-1.5 transition"
            >
              <Plus size={18} />
              <span>{lang === 'bn' ? 'নতুন লেনদেন' : 'Add Transaction'}</span>
            </button>
          </div>
        </div>

        {/* Search & Month Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="sm:col-span-2 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder={lang === 'bn' ? 'নোট, বিবরণ বা টাকার পরিমাণ দিয়ে খুঁজুন...' : 'Search by note, amount, category...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div>
            <select
              value={selectedMonth}
              onChange={(e) => onSelectMonth(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="">{lang === 'bn' ? 'সকল মাসের হিসাব' : 'All Months'}</option>
              {availableMonths.map((m) => {
                const [y, mNum] = m.split('-');
                const idx = parseInt(mNum, 10) - 1;
                const name = lang === 'bn' ? `${MONTH_NAMES_BN[idx]} ${toBnDigit(y)}` : `${MONTH_NAMES_EN[idx]} ${y}`;
                return (
                  <option key={m} value={m}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Expanded Filters Drawer */}
        {showFilters && (
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                {lang === 'bn' ? 'লেনদেনের ধরন:' : 'Type:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', bn: 'সব ধরন', en: 'All' },
                  { id: 'expense', bn: 'শুধুমাত্র খরচ 🔻', en: 'Expense Only' },
                  { id: 'income', bn: 'শুধুমাত্র আয় 🔺', en: 'Income Only' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTypeFilter(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      typeFilter === item.id
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang === 'bn' ? item.bn : item.en}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                {lang === 'bn' ? 'খাত অনুযায়ী ফিল্টার:' : 'Filter by Category:'}
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                    categoryFilter === 'all'
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400'
                  }`}
                >
                  {lang === 'bn' ? 'সকল খাত' : 'All Categories'}
                </button>
                {allCategories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategoryFilter(c.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition flex items-center gap-1 ${
                      categoryFilter === c.id
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }}></span>
                    <span>{lang === 'bn' ? c.nameBn : c.nameEn}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Micro Summary Strip */}
        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs text-slate-400">{lang === 'bn' ? 'মোট আয়:' : 'Income:'}</span>
            <span className="text-xs font-bold text-emerald-400">{formatTaka(totalInc, lang)}</span>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span className="text-xs text-slate-400">{lang === 'bn' ? 'মোট খরচ:' : 'Expense:'}</span>
            <span className="text-xs font-bold text-rose-400">{formatTaka(totalExp, lang)}</span>
          </div>
        </div>
      </div>

      {/* Transaction List Cards */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-12 rounded-3xl bg-[#121827]/60 border border-slate-800">
            <Calendar size={36} className="mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-400">
              {lang === 'bn' ? 'কোনো লেনদেন খুঁজে পাওয়া যায়নি।' : 'No transactions found.'}
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-3 text-xs text-emerald-400 hover:underline"
            >
              {lang === 'bn' ? '+ নতুন লেনদেন রেকর্ড করুন' : '+ Add a new transaction'}
            </button>
          </div>
        ) : (
          filtered.map((tx) => {
            const isExpense = tx.type === 'expense';
            const cat = getCategoryDetails(tx.category, tx.type);
            const methodLabel = getPaymentMethodName(tx.method);

            return (
              <div
                key={tx.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-[#121827]/80 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between gap-3 group"
              >
                {/* Left: Category Icon & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: `${cat.color}25` }}
                  >
                    <CategoryIcon name={cat.icon} size={20} color={cat.color} />
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">
                      {tx.note || (lang === 'bn' ? cat.nameBn : cat.nameEn)}
                    </h4>
                    
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[11px] text-slate-400">
                      <span>{formatDate(tx.date, lang)}</span>
                      <span>•</span>
                      <span className="text-slate-300 font-medium">
                        {lang === 'bn' ? cat.nameBn : cat.nameEn}
                      </span>
                      <span>•</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-400">
                        {methodLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                  <div className="text-right">
                    <span className={`text-sm sm:text-base font-bold block ${
                      isExpense ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {isExpense ? '-' : '+'}{formatTaka(tx.amount, lang)}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                      {isExpense ? (lang === 'bn' ? 'ব্যয়' : 'EXP') : (lang === 'bn' ? 'আয়' : 'INC')}
                    </span>
                  </div>

                  {/* Edit & Delete */}
                  <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition">
                    <button
                      type="button"
                      onClick={() => onOpenEditModal(tx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title={lang === 'bn' ? 'এডিট' : 'Edit'}
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(lang === 'bn' ? 'এই লেনদেনটি মুছে ফেলতে চান?' : 'Delete this transaction?')) {
                          onDeleteTransaction(tx.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                      title={lang === 'bn' ? 'মুছুন' : 'Delete'}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
