import React, { useMemo } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowDownLeft, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  ChevronRight, 
  Users, 
  Sparkles,
  PieChart,
  AlertCircle
} from 'lucide-react';
import { formatTaka, formatDate, toBnDigit } from '../utils/helpers';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, MONTH_NAMES_BN, MONTH_NAMES_EN } from '../constants/initialData';
import { CategoryIcon } from './CategoryIcon';

export const Dashboard = ({ 
  transactions, 
  debts, 
  selectedMonth, 
  onSelectMonth,
  onNavigateTab, 
  onOpenAddTxModal, 
  onOpenAddDebtModal,
  lang 
}) => {
  // Current month transactions
  const monthTx = useMemo(() => {
    if (!selectedMonth) return transactions;
    return transactions.filter(t => t.date && t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  // Income, Expense, Balance calculations
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    monthTx.forEach(t => {
      const amt = Number(t.amount) || 0;
      if (t.type === 'income') inc += amt;
      else if (t.type === 'expense') exp += amt;
    });
    return { totalIncome: inc, totalExpense: exp, balance: inc - exp };
  }, [monthTx]);

  // Dena-Paona totals
  const debtSummary = useMemo(() => {
    let receivable = 0;
    let payable = 0;
    debts.forEach(d => {
      const orig = Number(d.originalAmount) || 0;
      const paid = (d.repayments || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      const remaining = Math.max(0, orig - paid);
      if (d.status !== 'settled' && remaining > 0) {
        if (d.type === 'receivable') receivable += remaining;
        else payable += remaining;
      }
    });
    return { receivable, payable };
  }, [debts]);

  // Recent 5 transactions
  const recentTx = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  }, [transactions]);

  // Pending active debts (top 3)
  const activeDebts = useMemo(() => {
    return debts
      .filter(d => d.status !== 'settled')
      .slice(0, 3);
  }, [debts]);

  // Get current month human label
  const currentMonthLabel = useMemo(() => {
    if (!selectedMonth) return lang === 'bn' ? 'চলতি মাস' : 'Current Month';
    const [y, m] = selectedMonth.split('-');
    const idx = parseInt(m, 10) - 1;
    return lang === 'bn' ? `${MONTH_NAMES_BN[idx]} ${toBnDigit(y)}` : `${MONTH_NAMES_EN[idx]} ${y}`;
  }, [selectedMonth, lang]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero Financial Balance Card */}
      <div className="relative overflow-hidden p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-900/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <Sparkles size={13} />
              <span>{currentMonthLabel}</span>
            </div>
            <button
              onClick={() => onNavigateTab('analytics')}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1 transition"
            >
              <span>{lang === 'bn' ? 'অ্যানালিটিক্স' : 'Analytics'}</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="mt-2">
            <span className="text-xs sm:text-sm text-slate-400 font-medium">
              {lang === 'bn' ? 'মাসের মোট অবশিষ্ট ব্যালেন্স' : 'Net Monthly Balance'}
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1 tracking-tight">
              {formatTaka(balance, lang)}
            </div>
          </div>

          {/* Income vs Expense Pills */}
          <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-800/80">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <ArrowDownRight size={14} />
                {lang === 'bn' ? 'মোট আয়' : 'Total Income'}
              </span>
              <div className="text-base sm:text-lg font-bold text-white mt-0.5">
                {formatTaka(totalIncome, lang)}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-rose-400 font-semibold flex items-center gap-1">
                <ArrowUpRight size={14} />
                {lang === 'bn' ? 'মোট খরচ' : 'Total Expense'}
              </span>
              <div className="text-base sm:text-lg font-bold text-white mt-0.5">
                {formatTaka(totalExpense, lang)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          onClick={() => onOpenAddTxModal('expense')}
          className="p-3.5 rounded-2xl bg-[#121827] border border-slate-800 hover:border-rose-500/50 hover:bg-slate-900 transition flex flex-col items-center justify-center gap-2 group shadow-sm text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center group-hover:scale-105 transition">
            <ArrowUpRight size={20} />
          </div>
          <span className="text-xs font-semibold text-slate-200">
            {lang === 'bn' ? 'খরচ লিখুন' : 'Add Expense'}
          </span>
        </button>

        <button
          onClick={() => onOpenAddTxModal('income')}
          className="p-3.5 rounded-2xl bg-[#121827] border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition flex flex-col items-center justify-center gap-2 group shadow-sm text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition">
            <ArrowDownRight size={20} />
          </div>
          <span className="text-xs font-semibold text-slate-200">
            {lang === 'bn' ? 'আয় লিখুন' : 'Add Income'}
          </span>
        </button>

        <button
          onClick={onOpenAddDebtModal}
          className="p-3.5 rounded-2xl bg-[#121827] border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition flex flex-col items-center justify-center gap-2 group shadow-sm text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition">
            <Users size={20} />
          </div>
          <span className="text-xs font-semibold text-slate-200">
            {lang === 'bn' ? 'ধার-দেনা যোগ' : 'Add Debt'}
          </span>
        </button>
      </div>

      {/* Dena-Paona Quick Widget */}
      <div className="p-5 rounded-3xl bg-[#121827]/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              {lang === 'bn' ? 'ধার-দেনার বর্তমান স্থিতি (দেনা-পাওনা)' : 'Debts & Loans Status'}
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('debts')}
            className="text-xs text-emerald-400 hover:underline flex items-center gap-0.5"
          >
            <span>{lang === 'bn' ? 'বিস্তারিত' : 'View all'}</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div 
            onClick={() => onNavigateTab('debts')} 
            className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 hover:border-emerald-500/40 cursor-pointer transition"
          >
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <ArrowDownLeft size={14} />
              {lang === 'bn' ? 'আমি পাবো (পাওনা)' : 'To Receive'}
            </span>
            <div className="text-lg sm:text-xl font-bold text-white mt-1">
              {formatTaka(debtSummary.receivable, lang)}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              {lang === 'bn' ? 'অন্যরা আমাকে দিবে' : 'Owed to you'}
            </span>
          </div>

          <div 
            onClick={() => onNavigateTab('debts')} 
            className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/20 hover:border-rose-500/40 cursor-pointer transition"
          >
            <span className="text-[11px] text-rose-400 font-medium flex items-center gap-1">
              <ArrowUpRight size={14} />
              {lang === 'bn' ? 'আমি দেবো (দেনা)' : 'To Pay'}
            </span>
            <div className="text-lg sm:text-xl font-bold text-white mt-1">
              {formatTaka(debtSummary.payable, lang)}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              {lang === 'bn' ? 'আমার পরিশোধ করতে হবে' : 'You owe to others'}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="p-5 rounded-3xl bg-[#121827]/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">
              {lang === 'bn' ? 'সাম্প্রতিক লেনদেন' : 'Recent Transactions'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'bn' ? 'সর্বশেষ এন্ট্রি করা খরচের তালিকা' : 'Latest logged transactions'}
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('transactions')}
            className="text-xs text-emerald-400 hover:underline flex items-center gap-0.5"
          >
            <span>{lang === 'bn' ? 'সব দেখুন' : 'See all'}</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {recentTx.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            {lang === 'bn' ? 'কোনো লেনদেন এন্ট্রি করা হয়নি।' : 'No transactions recorded yet.'}
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentTx.map((tx) => {
              const isExpense = tx.type === 'expense';
              const catList = isExpense ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
              const cat = catList.find(c => c.id === tx.category) || {
                nameBn: tx.category,
                nameEn: tx.category,
                icon: 'MoreHorizontal',
                color: '#64748b'
              };

              return (
                <div
                  key={tx.id}
                  onClick={() => onNavigateTab('transactions')}
                  className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${cat.color}25` }}
                    >
                      <CategoryIcon name={cat.icon} size={17} color={cat.color} />
                    </div>

                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-semibold text-white block truncate">
                        {tx.note || (lang === 'bn' ? cat.nameBn : cat.nameEn)}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {formatDate(tx.date, lang)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-xs sm:text-sm font-bold block ${
                      isExpense ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {isExpense ? '-' : '+'}{formatTaka(tx.amount, lang)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
