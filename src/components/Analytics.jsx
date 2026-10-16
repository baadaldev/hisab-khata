import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  CheckCircle2,
  Wallet
} from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, MONTH_NAMES_BN, MONTH_NAMES_EN } from '../constants/initialData';
import { formatTaka, toBnDigit } from '../utils/helpers';
import { CategoryIcon } from './CategoryIcon';

export const Analytics = ({ transactions, selectedMonth, onSelectMonth, lang }) => {
  // Extract all unique months from transactions (format YYYY-MM)
  const availableMonths = useMemo(() => {
    const set = new Set();
    transactions.forEach(t => {
      if (t.date) set.add(t.date.slice(0, 7));
    });
    // Add current month if not present
    const now = new Date().toISOString().slice(0, 7);
    set.add(now);
    return Array.from(set).sort().reverse();
  }, [transactions]);

  // Current selected month data
  const currentMonthTx = useMemo(() => {
    if (!selectedMonth) return transactions;
    return transactions.filter(t => t.date && t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  // Total Income and Expense for selected month
  const { totalIncome, totalExpense, balance, savingsRate } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    currentMonthTx.forEach(t => {
      const amt = Number(t.amount) || 0;
      if (t.type === 'income') inc += amt;
      else if (t.type === 'expense') exp += amt;
    });
    const bal = inc - exp;
    const rate = inc > 0 ? Math.round((bal / inc) * 100) : 0;
    return { totalIncome: inc, totalExpense: exp, balance: bal, savingsRate: rate };
  }, [currentMonthTx]);

  // Category-wise Breakdown for selected month
  const categoryStats = useMemo(() => {
    const map = {};
    let totalExp = 0;

    currentMonthTx.forEach(t => {
      if (t.type === 'expense') {
        const amt = Number(t.amount) || 0;
        totalExp += amt;
        map[t.category] = (map[t.category] || 0) + amt;
      }
    });

    const list = Object.entries(map).map(([catId, amount]) => {
      const catObj = EXPENSE_CATEGORIES.find(c => c.id === catId) || {
        id: catId,
        nameBn: catId,
        nameEn: catId,
        icon: 'MoreHorizontal',
        color: '#64748b'
      };
      const percentage = totalExp > 0 ? Math.round((amount / totalExp) * 100) : 0;
      return {
        ...catObj,
        amount,
        percentage
      };
    }).sort((a, b) => b.amount - a.amount);

    return { list, totalExp };
  }, [currentMonthTx]);

  // Month-over-Month comparison data (last 6 months)
  const monthlyComparison = useMemo(() => {
    // Generate last 6 months list
    const months = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const mStr = d.toISOString().slice(0, 7);
      months.push(mStr);
    }

    let highestExp = 0;
    let lowestExp = Infinity;
    let highestMonth = '';
    let lowestMonth = '';

    const data = months.map(m => {
      const monthTx = transactions.filter(t => t.date && t.date.startsWith(m));
      let expense = 0;
      let income = 0;
      monthTx.forEach(t => {
        const amt = Number(t.amount) || 0;
        if (t.type === 'expense') expense += amt;
        else if (t.type === 'income') income += amt;
      });

      if (expense > highestExp) {
        highestExp = expense;
        highestMonth = m;
      }
      if (expense > 0 && expense < lowestExp) {
        lowestExp = expense;
        lowestMonth = m;
      }

      // Format month label
      const [year, monthNum] = m.split('-');
      const mIdx = parseInt(monthNum, 10) - 1;
      const label = lang === 'bn' 
        ? `${MONTH_NAMES_BN[mIdx].slice(0, 4)}` 
        : `${MONTH_NAMES_EN[mIdx].slice(0, 3)}`;

      return {
        monthKey: m,
        label,
        expense,
        income,
      };
    });

    const maxChartValue = Math.max(...data.map(d => Math.max(d.expense, d.income)), 1000);

    return {
      data,
      maxChartValue,
      highestExp,
      highestMonth,
      lowestExp: lowestExp === Infinity ? 0 : lowestExp,
      lowestMonth: lowestExp === Infinity ? '' : lowestMonth,
    };
  }, [transactions, lang]);

  // Calculate comparison with immediate previous month
  const monthComparisonInsight = useMemo(() => {
    if (!selectedMonth) return null;
    const [y, m] = selectedMonth.split('-').map(Number);
    const prevDate = new Date(y, m - 2, 1);
    const prevMonthStr = prevDate.toISOString().slice(0, 7);

    let prevExpense = 0;
    transactions.forEach(t => {
      if (t.date && t.date.startsWith(prevMonthStr) && t.type === 'expense') {
        prevExpense += Number(t.amount) || 0;
      }
    });

    if (prevExpense === 0) return null;

    const diff = totalExpense - prevExpense;
    const pct = Math.round((Math.abs(diff) / prevExpense) * 100);

    return {
      isHigher: diff > 0,
      diff: Math.abs(diff),
      percentage: pct,
    };
  }, [selectedMonth, transactions, totalExpense]);

  const topCategory = categoryStats.list[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Month Picker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#121827]/80 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="text-emerald-400" size={20} />
            <span>{lang === 'bn' ? 'মাসের খরচ ও খাতের বিশ্লেষণ' : 'Monthly Expense Analytics'}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {lang === 'bn' 
              ? 'কোন খাতে কত খরচ হয়েছে এবং কোন মাসে বেশি/কম বিস্তারিত দেখুন' 
              : 'Detailed breakdown of expenses by category and month comparison'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-slate-400" />
          <select
            value={selectedMonth}
            onChange={(e) => onSelectMonth(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
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

      {/* Monthly Summary 3-Column Stat */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900/60 border border-emerald-500/20">
          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
            <ArrowDownRight size={14} />
            {lang === 'bn' ? 'এই মাসের মোট আয়' : 'Total Income'}
          </span>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1">
            {formatTaka(totalIncome, lang)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/40 to-slate-900/60 border border-rose-500/20">
          <span className="text-xs text-rose-400 font-medium flex items-center gap-1.5">
            <ArrowUpRight size={14} />
            {lang === 'bn' ? 'এই মাসের মোট খরচ' : 'Total Expense'}
          </span>
          <div className="text-xl sm:text-2xl font-bold text-white mt-1">
            {formatTaka(totalExpense, lang)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border border-indigo-500/20">
          <span className="text-xs text-indigo-400 font-medium flex items-center gap-1.5">
            <Wallet size={14} />
            {lang === 'bn' ? 'চলতি অবশিষ্ট ব্যালেন্স' : 'Net Savings'}
          </span>
          <div className={`text-xl sm:text-2xl font-bold mt-1 ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatTaka(balance, lang)}
          </div>
        </div>
      </div>

      {/* Smart Insight Banner */}
      {monthComparisonInsight && (
        <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
          monthComparisonInsight.isHigher 
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' 
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
        }`}>
          <div className="p-2 rounded-xl bg-slate-900/50 shrink-0">
            {monthComparisonInsight.isHigher ? <TrendingUp size={20} className="text-amber-400" /> : <TrendingDown size={20} className="text-emerald-400" />}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">
              {monthComparisonInsight.isHigher 
                ? (lang === 'bn' ? 'গত মাসের চেয়ে খরচ বেড়েছে!' : 'Expenses increased from last month!') 
                : (lang === 'bn' ? 'চমৎকার! গত মাসের চেয়ে খরচ কমেছে' : 'Great! Expenses decreased from last month')}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {lang === 'bn' ? (
                <>গত মাসের তুলনায় আপনার খরচ <strong>{toBnDigit(monthComparisonInsight.percentage)}%</strong> ({formatTaka(monthComparisonInsight.diff, lang)}) {monthComparisonInsight.isHigher ? 'বেশি হয়েছে।' : 'কম হয়েছে।'}</>
              ) : (
                <>Your spending is <strong>{monthComparisonInsight.percentage}%</strong> ({formatTaka(monthComparisonInsight.diff, lang)}) {monthComparisonInsight.isHigher ? 'higher than' : 'lower than'} the previous month.</>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Section 1: Month-over-Month Comparison Chart (কোন মাসে বেশি/কম) */}
      <div className="p-5 rounded-3xl bg-[#121827]/90 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="text-emerald-400" size={18} />
              <span>{lang === 'bn' ? 'বিগত ৬ মাসের খরচের তুলনা (Month-over-Month)' : '6-Month Expense Comparison'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'bn' ? 'কোন মাসে খরচ বেশি আর কোন মাসে কম হয়েছে সহজে তুলনা করুন' : 'Easily compare spending trends across months'}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              <span className="text-slate-400">{lang === 'bn' ? 'খরচ' : 'Expense'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span className="text-slate-400">{lang === 'bn' ? 'আয়' : 'Income'}</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="pt-4 pb-2">
          <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-slate-800">
            {monthlyComparison.data.map((item) => {
              const expHeightPct = Math.min(100, Math.round((item.expense / monthlyComparison.maxChartValue) * 100));
              const incHeightPct = Math.min(100, Math.round((item.income / monthlyComparison.maxChartValue) * 100));
              const isSelected = item.monthKey === selectedMonth;
              const isHighest = item.monthKey === monthlyComparison.highestMonth && item.expense > 0;
              const isLowest = item.monthKey === monthlyComparison.lowestMonth && item.expense > 0;

              return (
                <div 
                  key={item.monthKey} 
                  onClick={() => onSelectMonth(item.monthKey)}
                  className={`flex-1 flex flex-col items-center justify-end h-full group cursor-pointer transition p-1 rounded-xl ${
                    isSelected ? 'bg-slate-800/60 ring-1 ring-emerald-500/40' : 'hover:bg-slate-800/30'
                  }`}
                >
                  {/* Tooltip / Badges on top */}
                  <div className="mb-2 text-center">
                    {isHighest && (
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded-md font-medium whitespace-nowrap hidden sm:inline-block">
                        {lang === 'bn' ? 'সর্বোচ্চ' : 'Peak'}
                      </span>
                    )}
                    {isLowest && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-md font-medium whitespace-nowrap hidden sm:inline-block">
                        {lang === 'bn' ? 'সর্বনিম্ন' : 'Lowest'}
                      </span>
                    )}
                  </div>

                  {/* Bars Container */}
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-40">
                    {/* Income Bar */}
                    <div 
                      className="w-1/2 max-w-[20px] bg-emerald-500/70 hover:bg-emerald-400 rounded-t-md transition-all relative"
                      style={{ height: `${Math.max(incHeightPct, 4)}%` }}
                      title={`Income: ৳${item.income}`}
                    ></div>
                    {/* Expense Bar */}
                    <div 
                      className={`w-1/2 max-w-[20px] rounded-t-md transition-all relative ${
                        isHighest ? 'bg-rose-500 shadow-lg shadow-rose-500/20' : 'bg-rose-500/70 hover:bg-rose-400'
                      }`}
                      style={{ height: `${Math.max(expHeightPct, 4)}%` }}
                      title={`Expense: ৳${item.expense}`}
                    ></div>
                  </div>

                  {/* Label */}
                  <div className="mt-2 text-center">
                    <span className={`text-[11px] sm:text-xs block font-medium ${
                      isSelected ? 'text-emerald-400 font-bold' : 'text-slate-400'
                    }`}>
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-500 hidden sm:block">
                      {formatTaka(item.expense, lang)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Highlights Footer */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <TrendingUp size={16} />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">{lang === 'bn' ? 'সর্বোচ্চ খরচের মাস' : 'Highest Spending Month'}</span>
              <span className="text-xs sm:text-sm font-bold text-rose-300">
                {monthlyComparison.highestMonth ? `${monthlyComparison.highestMonth} (${formatTaka(monthlyComparison.highestExp, lang)})` : 'N/A'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <TrendingDown size={16} />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">{lang === 'bn' ? 'সর্বনিম্ন খরচের মাস' : 'Lowest Spending Month'}</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-300">
                {monthlyComparison.lowestMonth ? `${monthlyComparison.lowestMonth} (${formatTaka(monthlyComparison.lowestExp, lang)})` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Category Breakdown (কোন খাতে কত খরচ) */}
      <div className="p-5 rounded-3xl bg-[#121827]/90 border border-slate-800 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PieChart className="text-emerald-400" size={18} />
            <span>{lang === 'bn' ? 'খাত অনুযায়ী খরচের অনুপাত ও তালিকা' : 'Expense Breakdown by Category'}</span>
          </h3>
          <p className="text-xs text-slate-400">
            {lang === 'bn' 
              ? `নির্বাচিত মাসে মোট খরচ হয়েছে ${formatTaka(categoryStats.totalExp, lang)}` 
              : `Total spending this month: ${formatTaka(categoryStats.totalExp, lang)}`}
          </p>
        </div>

        {/* Top Highlight Category */}
        {topCategory && (
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${topCategory.color}25` }}
            >
              <CategoryIcon name={topCategory.icon} size={20} color={topCategory.color} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Sparkles size={12} className="text-amber-400" />
                {lang === 'bn' ? 'সবচেয়ে বড় খরচের খাত' : 'Largest Expense Category'}
              </span>
              <div className="text-sm font-bold text-white truncate">
                {lang === 'bn' ? topCategory.nameBn : topCategory.nameEn}
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-rose-400">{formatTaka(topCategory.amount, lang)}</span>
              <span className="text-xs text-slate-400 block font-semibold">{toBnDigit(topCategory.percentage)}%</span>
            </div>
          </div>
        )}

        {/* Visual Progress Bars for each category */}
        {categoryStats.list.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            {lang === 'bn' ? 'এই মাসে এখনো কোনো খরচ রেকর্ড করা হয়নি।' : 'No expenses recorded for this month.'}
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {categoryStats.list.map((cat) => (
              <div key={cat.id} className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${cat.color}25` }}
                    >
                      <CategoryIcon name={cat.icon} size={15} color={cat.color} />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-slate-200 truncate">
                      {lang === 'bn' ? cat.nameBn : cat.nameEn}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {formatTaka(cat.amount, lang)}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {toBnDigit(cat.percentage)}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color || '#10b981'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
