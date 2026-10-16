import React, { useState, useMemo } from 'react';
import { 
  Users, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Plus, 
  Search, 
  MessageCircle, 
  Phone, 
  CheckCircle, 
  Clock, 
  Edit3, 
  Trash2, 
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { formatTaka, formatDate, generateWhatsAppLink, toBnDigit } from '../utils/helpers';

export const DenaPaona = ({ 
  debts, 
  onOpenAddModal, 
  onOpenEditModal, 
  onOpenRepayModal, 
  onDeleteDebt, 
  lang 
}) => {
  const [activeTab, setActiveTab] = useState('receivable'); // 'receivable' (আমি পাবো) | 'payable' (আমি দেবো)
  const [statusFilter, setStatusFilter] = useState('active'); // 'active' | 'settled' | 'all'
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate totals
  const summary = useMemo(() => {
    let totalReceivable = 0;
    let totalPayable = 0;
    let totalReceivablePaid = 0;
    let totalPayablePaid = 0;

    debts.forEach((d) => {
      const orig = Number(d.originalAmount) || 0;
      const paid = (d.repayments || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      const remaining = Math.max(0, orig - paid);

      if (d.type === 'receivable') {
        totalReceivable += remaining;
        totalReceivablePaid += paid;
      } else {
        totalPayable += remaining;
        totalPayablePaid += paid;
      }
    });

    return {
      totalReceivable,
      totalPayable,
      totalReceivablePaid,
      totalPayablePaid,
      netBalance: totalReceivable - totalPayable
    };
  }, [debts]);

  // Filtered debts
  const filteredDebts = useMemo(() => {
    return debts.filter((d) => {
      if (d.type !== activeTab) return false;

      const totalPaid = (d.repayments || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      const isSettled = d.status === 'settled' || totalPaid >= (Number(d.originalAmount) || 0);

      if (statusFilter === 'active' && isSettled) return false;
      if (statusFilter === 'settled' && !isSettled) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = (d.person || '').toLowerCase().includes(query);
        const noteMatch = (d.note || '').toLowerCase().includes(query);
        const phoneMatch = (d.phone || '').includes(query);
        return nameMatch || noteMatch || phoneMatch;
      }

      return true;
    });
  }, [debts, activeTab, statusFilter, searchQuery]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Dena-Paona Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Receivable Summary (আমি পাবো) */}
        <div 
          onClick={() => setActiveTab('receivable')}
          className={`p-4 rounded-2xl border cursor-pointer transition ${
            activeTab === 'receivable'
              ? 'bg-emerald-950/40 border-emerald-500/50 ring-1 ring-emerald-500/30'
              : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <ArrowDownLeft size={16} />
              {lang === 'bn' ? 'আমি পাবো (মোট পাওনা)' : 'I will Receive (Receivable)'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {toBnDigit(debts.filter(d => d.type === 'receivable' && d.status !== 'settled').length)} {lang === 'bn' ? 'টি হিসাব' : 'entries'}
            </span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {formatTaka(summary.totalReceivable, lang)}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>{lang === 'bn' ? 'পরিশোধিত হয়েছে:' : 'Already received:'}</span>
            <span className="text-emerald-400 font-medium">{formatTaka(summary.totalReceivablePaid, lang)}</span>
          </div>
        </div>

        {/* Payable Summary (আমি দেবো) */}
        <div 
          onClick={() => setActiveTab('payable')}
          className={`p-4 rounded-2xl border cursor-pointer transition ${
            activeTab === 'payable'
              ? 'bg-rose-950/40 border-rose-500/50 ring-1 ring-rose-500/30'
              : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
              <ArrowUpRight size={16} />
              {lang === 'bn' ? 'আমি দেবো (মোট দেনা)' : 'I will Pay (Payable)'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {toBnDigit(debts.filter(d => d.type === 'payable' && d.status !== 'settled').length)} {lang === 'bn' ? 'টি হিসাব' : 'entries'}
            </span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {formatTaka(summary.totalPayable, lang)}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>{lang === 'bn' ? 'আমি দিয়েছি:' : 'Already paid:'}</span>
            <span className="text-rose-400 font-medium">{formatTaka(summary.totalPayablePaid, lang)}</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#121827]/90 border border-slate-800 space-y-4">
        {/* Navigation Tabs & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800 w-full sm:w-80">
            <button
              onClick={() => setActiveTab('receivable')}
              className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'receivable'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowDownLeft size={15} />
              <span>{lang === 'bn' ? 'আমি পাবো (পাওনা)' : 'I will Receive'}</span>
            </button>
            <button
              onClick={() => setActiveTab('payable')}
              className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'payable'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowUpRight size={15} />
              <span>{lang === 'bn' ? 'আমি দেবো (দেনা)' : 'I will Pay'}</span>
            </button>
          </div>

          <button
            onClick={onOpenAddModal}
            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition"
          >
            <Plus size={18} />
            <span>{lang === 'bn' ? 'নতুন দেনা-পাওনা যোগ' : 'Add New Debt/Loan'}</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder={lang === 'bn' ? 'নাম বা বিবরণ দিয়ে খুঁজুন...' : 'Search by name or note...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            {['active', 'settled', 'all'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-medium border transition ${
                  statusFilter === status
                    ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                {status === 'active' 
                  ? (lang === 'bn' ? 'চলমান (বাকি)' : 'Active') 
                  : status === 'settled' 
                  ? (lang === 'bn' ? 'পরিশোধিত' : 'Settled') 
                  : (lang === 'bn' ? 'সব' : 'All')}
              </button>
            ))}
          </div>
        </div>

        {/* Debts List */}
        <div className="space-y-3 pt-2">
          {filteredDebts.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-slate-900/30 border border-slate-800/60">
              <Users size={36} className="mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-400">
                {lang === 'bn' ? 'কোনো হিসাব পাওয়া যায়নি।' : 'No records found.'}
              </p>
              <button
                onClick={onOpenAddModal}
                className="mt-3 text-xs text-emerald-400 hover:underline"
              >
                {lang === 'bn' ? '+ একটি নতুন হিসাব যোগ করুন' : '+ Add an entry'}
              </button>
            </div>
          ) : (
            filteredDebts.map((debt) => {
              const orig = Number(debt.originalAmount) || 0;
              const paid = (debt.repayments || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
              const remaining = Math.max(0, orig - paid);
              const isSettled = debt.status === 'settled' || remaining === 0;
              const percentPaid = orig > 0 ? Math.min(100, Math.round((paid / orig) * 100)) : 100;
              const waLink = generateWhatsAppLink(debt, lang);

              return (
                <div
                  key={debt.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSettled 
                      ? 'bg-slate-900/30 border-slate-800/50 opacity-75' 
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Person Details */}
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isSettled 
                          ? 'bg-slate-800 text-slate-400' 
                          : debt.type === 'receivable' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {isSettled ? <CheckCircle size={20} /> : <Users size={20} />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white truncate">{debt.person}</h4>
                          {isSettled ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {lang === 'bn' ? 'পরিশোধিত' : 'Settled'}
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              {lang === 'bn' ? 'বাকি আছে' : 'Pending'}
                            </span>
                          )}
                        </div>

                        {debt.phone && (
                          <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Phone size={12} />
                            <span>{debt.phone}</span>
                          </div>
                        )}

                        {debt.note && (
                          <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic">
                            "{debt.note}"
                          </p>
                        )}

                        {debt.dueDate && (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                            <Clock size={11} />
                            <span>{lang === 'bn' ? 'পরিশোধের তারিখ:' : 'Due:'} {formatDate(debt.dueDate, lang)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Financial Numbers & Actions */}
                    <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/80">
                      <div className="text-left sm:text-right">
                        <span className="text-xs text-slate-400 block">{lang === 'bn' ? 'বাকি টাকা' : 'Remaining'}</span>
                        <span className={`text-lg sm:text-xl font-bold ${
                          isSettled ? 'text-slate-400' : debt.type === 'receivable' ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {formatTaka(remaining, lang)}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          {lang === 'bn' ? 'মূল:' : 'Orig:'} {formatTaka(orig, lang)}
                        </span>
                      </div>

                      {/* Action Buttons Row */}
                      <div className="flex items-center gap-1.5 mt-2">
                        {/* WhatsApp Reminder Button */}
                        {!isSettled && (
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition"
                            title={lang === 'bn' ? 'হোয়াটসঅ্যাপ রিমাইন্ডার পাঠান' : 'Send WhatsApp Reminder'}
                          >
                            <MessageCircle size={15} />
                          </a>
                        )}

                        {/* Repay / Installment Button */}
                        <button
                          type="button"
                          onClick={() => onOpenRepayModal(debt)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 flex items-center gap-1 transition"
                        >
                          <CreditCard size={13} className="text-emerald-400" />
                          <span>{lang === 'bn' ? 'কিস্তি/জমা' : 'Pay'}</span>
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => onOpenEditModal(debt)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        >
                          <Edit3 size={15} />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(lang === 'bn' ? 'এই হিসাবটি মুছে ফেলতে চান?' : 'Delete this entry?')) {
                              onDeleteDebt(debt.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Repayment Progress Bar */}
                  {orig > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-800/60">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>{lang === 'bn' ? 'পরিশোধ অগ্রগতি' : 'Repayment progress'}</span>
                        <span>{toBnDigit(percentPaid)}% ({formatTaka(paid, lang)})</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isSettled ? 'bg-emerald-500' : 'bg-emerald-400/80'
                          }`}
                          style={{ width: `${percentPaid}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
