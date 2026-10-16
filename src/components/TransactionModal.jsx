import React, { useState, useEffect } from 'react';
import { X, Check, Calendar, CreditCard, Tag, FileText } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '../constants/initialData';
import { CategoryIcon } from './CategoryIcon';

export const TransactionModal = ({ isOpen, onClose, onSave, editingTx, lang }) => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [method, setMethod] = useState('cash');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');

  useEffect(() => {
    if (editingTx) {
      setType(editingTx.type || 'expense');
      setAmount(editingTx.amount ? String(editingTx.amount) : '');
      setCategory(editingTx.category || (editingTx.type === 'income' ? 'salary' : 'food'));
      setMethod(editingTx.method || 'cash');
      setDate(editingTx.date || new Date().toISOString().slice(0, 10));
      setNote(editingTx.note || '');
    } else {
      setType('expense');
      setAmount('');
      setCategory('food');
      setMethod('cash');
      setDate(new Date().toISOString().slice(0, 10));
      setNote('');
    }
  }, [editingTx, isOpen]);

  // When type changes, ensure valid default category
  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'expense' && !EXPENSE_CATEGORIES.some(c => c.id === category)) {
      setCategory('food');
    } else if (newType === 'income' && !INCOME_CATEGORIES.some(c => c.id === category)) {
      setCategory('salary');
    }
  };

  if (!isOpen) return null;

  const currentCategories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      alert(lang === 'bn' ? 'দয়া করে সঠিক টাকার পরিমাণ লিখুন।' : 'Please enter a valid amount.');
      return;
    }

    const payload = {
      id: editingTx ? editingTx.id : 'tx-' + Date.now(),
      type,
      amount: parsedAmount,
      category,
      method,
      date: date || new Date().toISOString().slice(0, 10),
      note: note.trim(),
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
            <span>{editingTx ? (lang === 'bn' ? 'লেনদেন সম্পাদনা' : 'Edit Transaction') : (lang === 'bn' ? 'নতুন লেনদেন যোগ করুন' : 'Add New Transaction')}</span>
          </h3>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Expense / Income Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 ${
                type === 'expense'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🔻</span> {lang === 'bn' ? 'খরচ (Expense)' : 'Expense'}
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 ${
                type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🔺</span> {lang === 'bn' ? 'আয় (Income)' : 'Income'}
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              {lang === 'bn' ? 'টাকার পরিমাণ (BDT)' : 'Amount (BDT)'} <span className="text-rose-400">*</span>
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
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                className="w-full pl-12 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-2xl font-bold text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
              <Tag size={14} />
              <span>{lang === 'bn' ? 'ক্যাটাগরি / খাত' : 'Category'}</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
              {currentCategories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-center transition ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-md'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${cat.color}25` }}
                    >
                      <CategoryIcon name={cat.icon} size={16} color={cat.color} />
                    </div>
                    <span className="text-xs font-medium line-clamp-1">
                      {lang === 'bn' ? cat.nameBn : cat.nameEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
              <CreditCard size={14} />
              <span>{lang === 'bn' ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((m) => {
                const isSelected = method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {lang === 'bn' ? m.nameBn : m.nameEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Note in Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <Calendar size={14} />
                <span>{lang === 'bn' ? 'তারিখ' : 'Date'}</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <FileText size={14} />
                <span>{lang === 'bn' ? 'নোট / বিবরণ (ঐচ্ছিক)' : 'Note (Optional)'}</span>
              </label>
              <input
                type="text"
                placeholder={lang === 'bn' ? 'যেমন: রাতের বাজার, ভাড়া...' : 'e.g. Dinner with team'}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
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
              <span>{editingTx ? (lang === 'bn' ? 'আপডেট করুন' : 'Update') : (lang === 'bn' ? 'সেভ করুন' : 'Save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
