import React, { useState } from 'react';
import { X, Check, Calendar, FileText, History, CheckCircle, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatTaka, formatDate } from '../utils/helpers';

export const RepaymentModal = ({ isOpen, onClose, debt, onAddRepayment, onDeleteRepayment, onToggleStatus, lang }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');

  if (!isOpen || !debt) return null;

  const totalPaid = (debt.repayments || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const remaining = Math.max(0, (Number(debt.originalAmount) || 0) - totalPaid);
  const isSettled = debt.status === 'settled' || remaining === 0;

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      alert(lang === 'bn' ? 'দয়া করে সঠিক টাকার পরিমাণ দিন।' : 'Please enter a valid amount.');
      return;
    }

    const newPayment = {
      id: 'rep-' + Date.now(),
      amount: parsedAmount,
      date: date || new Date().toISOString().slice(0, 10),
      note: note.trim(),
    };

    const willBeSettled = remaining - parsedAmount <= 0;
    if (willBeSettled) {
      triggerConfetti();
    }

    onAddRepayment(debt.id, newPayment, willBeSettled);
    setAmount('');
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full sm:max-w-lg bg-[#111726] border border-slate-700/60 rounded-t-3xl sm:rounded-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{debt.person}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                debt.type === 'receivable' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {debt.type === 'receivable' ? (lang === 'bn' ? 'পাওনা টাকা' : 'Receivable') : (lang === 'bn' ? 'দেনা টাকা' : 'Payable')}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'bn' ? 'আংশিক বা সম্পূর্ণ পরিশোধের হিসাব' : 'Partial or full payment settlement'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Balance Overview Card */}
        <div className="p-4 grid grid-cols-3 gap-2 bg-slate-900/60 border-b border-slate-800 text-center">
          <div className="p-2.5 rounded-xl bg-slate-800/40">
            <span className="block text-[11px] text-slate-400 mb-0.5">{lang === 'bn' ? 'মূল পরিমাণ' : 'Original'}</span>
            <span className="text-sm font-bold text-slate-200">{formatTaka(debt.originalAmount, lang)}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="block text-[11px] text-emerald-400 mb-0.5">{lang === 'bn' ? 'পরিশোধ হয়েছে' : 'Total Paid'}</span>
            <span className="text-sm font-bold text-emerald-300">{formatTaka(totalPaid, lang)}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <span className="block text-[11px] text-rose-400 mb-0.5">{lang === 'bn' ? 'অবশিষ্ট বাকি' : 'Remaining'}</span>
            <span className="text-sm font-bold text-rose-300">{formatTaka(remaining, lang)}</span>
          </div>
        </div>

        {/* Add Payment Form */}
        {!isSettled ? (
          <form onSubmit={handleSubmit} className="p-4 border-b border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                {lang === 'bn' ? 'নতুন কিস্তি / টাকা জমা দিন' : 'Record New Payment'}
              </label>
              {remaining > 0 && (
                <button
                  type="button"
                  onClick={() => setAmount(String(remaining))}
                  className="text-xs text-emerald-400 hover:underline"
                >
                  {lang === 'bn' ? 'বাকি পুরো টাকা (' + formatTaka(remaining, lang) + ')' : 'Fill remaining'}
                </button>
              )}
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-emerald-400">৳</span>
              <input
                type="number"
                step="any"
                max={remaining}
                required
                placeholder={lang === 'bn' ? 'টাকার পরিমাণ...' : 'Amount...'}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-lg font-bold text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                placeholder={lang === 'bn' ? 'নোট (যেমন: ক্যাশে দিল)' : 'Note (e.g. via bKash)'}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold shadow-md transition flex items-center justify-center gap-2"
            >
              <Check size={16} />
              <span>{lang === 'bn' ? 'টাকা জমা নিশ্চিত করুন' : 'Submit Payment'}</span>
            </button>
          </form>
        ) : (
          <div className="p-4 bg-emerald-500/10 border-b border-emerald-500/20 text-center flex flex-col items-center justify-center py-6 gap-2">
            <CheckCircle size={36} className="text-emerald-400" />
            <h4 className="text-sm font-bold text-emerald-300">
              {lang === 'bn' ? 'এই হিসাবটি সম্পূর্ণ পরিশোধিত!' : 'This debt is fully settled!'}
            </h4>
            <button
              type="button"
              onClick={() => onToggleStatus(debt.id)}
              className="text-xs text-slate-400 hover:text-slate-200 underline mt-1"
            >
              {lang === 'bn' ? 'পুনরায় সক্রিয় করুন (Reopen)' : 'Reopen debt'}
            </button>
          </div>
        )}

        {/* Payment History Log */}
        <div className="p-4 flex-1 overflow-y-auto">
          <h4 className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
            <History size={14} />
            <span>{lang === 'bn' ? 'পরিশোধের ইতিহাস' : 'Payment History'}</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-full">
              {(debt.repayments || []).length}
            </span>
          </h4>

          {(!debt.repayments || debt.repayments.length === 0) ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              {lang === 'bn' ? 'এখনো কোনো টাকা জমা হয়নি।' : 'No payments logged yet.'}
            </div>
          ) : (
            <div className="space-y-2">
              {debt.repayments.map((rep) => (
                <div
                  key={rep.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-emerald-400">
                      +{formatTaka(rep.amount, lang)}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatDate(rep.date, lang)} {rep.note ? `• ${rep.note}` : ''}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(lang === 'bn' ? 'এই জমার রেকর্ডটি মুছতে চান?' : 'Delete this payment record?')) {
                        onDeleteRepayment(debt.id, rep.id);
                      }
                    }}
                    className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
