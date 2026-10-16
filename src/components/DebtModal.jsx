import React, { useState, useEffect } from 'react';
import { X, Check, User, Phone, Calendar, FileText, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export const DebtModal = ({ isOpen, onClose, onSave, editingDebt, lang }) => {
  const [type, setType] = useState('receivable'); // 'receivable' (আমি পাবো) | 'payable' (আমি দেবো)
  const [person, setPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [originalAmount, setOriginalAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (editingDebt) {
      setType(editingDebt.type || 'receivable');
      setPerson(editingDebt.person || '');
      setPhone(editingDebt.phone || '');
      setOriginalAmount(editingDebt.originalAmount ? String(editingDebt.originalAmount) : '');
      setDueDate(editingDebt.dueDate || '');
      setNote(editingDebt.note || '');
    } else {
      setType('receivable');
      setPerson('');
      setPhone('');
      setOriginalAmount('');
      setDueDate('');
      setNote('');
    }
  }, [editingDebt, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(originalAmount);
    if (!parsedAmount || parsedAmount <= 0) {
      alert(lang === 'bn' ? 'দয়া করে সঠিক টাকার পরিমাণ লিখুন।' : 'Please enter a valid amount.');
      return;
    }
    if (!person.trim()) {
      alert(lang === 'bn' ? 'দয়া করে ব্যক্তির নাম লিখুন।' : 'Please enter person name.');
      return;
    }

    const payload = {
      id: editingDebt ? editingDebt.id : 'debt-' + Date.now(),
      type,
      person: person.trim(),
      phone: phone.trim(),
      originalAmount: parsedAmount,
      dueDate: dueDate || '',
      note: note.trim(),
      repayments: editingDebt ? (editingDebt.repayments || []) : [],
      status: editingDebt ? (editingDebt.status || 'active') : 'active',
      createdAt: editingDebt ? editingDebt.createdAt : new Date().toISOString().slice(0, 10),
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full sm:max-w-lg bg-[#111726] border border-slate-700/60 rounded-t-3xl sm:rounded-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>
              {editingDebt 
                ? (lang === 'bn' ? 'ধার-দেনার তথ্য এডিট' : 'Edit Debt/Loan') 
                : (lang === 'bn' ? 'নতুন ধার-দেনার হিসাব যোগ' : 'Add Debt / Loan Entry')}
            </span>
          </h3>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Debt Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setType('receivable')}
              className={`py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-1.5 ${
                type === 'receivable'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowDownLeft size={16} />
              <span>{lang === 'bn' ? 'আমি পাবো (পাওনা)' : 'I will Receive'}</span>
            </button>
            <button
              type="button"
              onClick={() => setType('payable')}
              className={`py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-1.5 ${
                type === 'payable'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowUpRight size={16} />
              <span>{lang === 'bn' ? 'আমি দেবো (দেনা)' : 'I will Pay'}</span>
            </button>
          </div>

          {/* Person Name */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
              <User size={14} />
              <span>{lang === 'bn' ? 'ব্যক্তির / প্রতিষ্ঠানের নাম' : 'Person / Party Name'} <span className="text-rose-400">*</span></span>
            </label>
            <input
              type="text"
              required
              placeholder={lang === 'bn' ? 'যেমন: সাকিব হাসান, দোকানদার ভাই' : 'e.g. John Doe, Landlord'}
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              {lang === 'bn' ? 'মূল টাকার পরিমাণ' : 'Total Amount'} <span className="text-rose-400">*</span>
            </label>
            <div className="relative rounded-xl overflow-hidden">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-emerald-400">
                ৳
              </span>
              <input
                type="number"
                step="any"
                required
                placeholder="0.00"
                value={originalAmount}
                onChange={(e) => setOriginalAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-2xl font-bold text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Phone Number (for WhatsApp/SMS) */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
              <Phone size={14} />
              <span>{lang === 'bn' ? 'মোবাইল নম্বর (হোয়াটসঅ্যাপ রিমাইন্ডারের জন্য)' : 'Phone Number (For WhatsApp reminders)'}</span>
            </label>
            <input
              type="tel"
              placeholder="017XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Due Date & Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <Calendar size={14} />
                <span>{lang === 'bn' ? 'পরিশোধের শেষ তারিখ (ঐচ্ছিক)' : 'Due Date (Optional)'}</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <FileText size={14} />
                <span>{lang === 'bn' ? 'নোট / ধারের কারণ' : 'Reason / Note'}</span>
              </label>
              <input
                type="text"
                placeholder={lang === 'bn' ? 'জরুরি ধার, বিল বাকি...' : 'Emergency, Grocery bill...'}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition"
            >
              {lang === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition"
            >
              <Check size={16} />
              <span>{editingDebt ? (lang === 'bn' ? 'আপডেট করুন' : 'Update') : (lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
