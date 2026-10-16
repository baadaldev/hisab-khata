import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ReceiptText, 
  Users, 
  BarChart3, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  X 
} from 'lucide-react';

export const BottomNav = ({ 
  activeTab, 
  onSelectTab, 
  onOpenAddTxModal, 
  onOpenAddDebtModal, 
  lang 
}) => {
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const tabs = [
    { id: 'dashboard', bn: 'ড্যাশবোর্ড', en: 'Home', icon: LayoutDashboard },
    { id: 'transactions', bn: 'লেনদেন', en: 'History', icon: ReceiptText },
    { id: 'debts', bn: 'দেনা-পাওনা', en: 'Debts', icon: Users },
    { id: 'analytics', bn: 'অ্যানালিটিক্স', en: 'Reports', icon: BarChart3 },
  ];

  return (
    <>
      {/* Quick Add Overlay Menu when FAB clicked */}
      {showQuickMenu && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end p-4 pb-24 animate-fadeIn"
          onClick={() => setShowQuickMenu(false)}
        >
          <div 
            className="max-w-xs mx-auto w-full bg-[#111726] border border-slate-700/80 rounded-3xl p-3 shadow-2xl space-y-2 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center py-1">
              <span className="text-[11px] font-semibold text-slate-400">
                {lang === 'bn' ? 'কী যোগ করতে চান?' : 'What would you like to add?'}
              </span>
            </div>

            <button
              onClick={() => {
                setShowQuickMenu(false);
                onOpenAddTxModal('expense');
              }}
              className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 text-left flex items-center gap-3 group transition"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-105 transition">
                <ArrowUpRight size={18} />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-white block">
                  {lang === 'bn' ? 'খরচ লিখুন (Expense)' : 'Add Expense'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {lang === 'bn' ? 'দৈনিক বাজার, ভাড়া, বিল ইত্যাদি' : 'Daily grocery, bills, shopping'}
                </span>
              </div>
            </button>

            <button
              onClick={() => {
                setShowQuickMenu(false);
                onOpenAddTxModal('income');
              }}
              className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-left flex items-center gap-3 group transition"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition">
                <ArrowDownRight size={18} />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-white block">
                  {lang === 'bn' ? 'আয় লিখুন (Income)' : 'Add Income'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {lang === 'bn' ? 'বেতন, ফ্রিল্যান্সিং, পকেট মানি' : 'Salary, freelance, allowance'}
                </span>
              </div>
            </button>

            <button
              onClick={() => {
                setShowQuickMenu(false);
                onOpenAddDebtModal();
              }}
              className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-left flex items-center gap-3 group transition"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition">
                <Users size={18} />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-white block">
                  {lang === 'bn' ? 'ধার-দেনার হিসাব (Debt/Loan)' : 'Add Debt / Loan'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {lang === 'bn' ? 'কারো কাছে পাবো বা দেবো' : 'Receivable or Payable record'}
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Persistent Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d1322]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 sm:py-2">
        <div className="max-w-md mx-auto flex items-center justify-around relative">
          {/* Tab 1: Dashboard */}
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
              activeTab === 'dashboard' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard size={20} className={activeTab === 'dashboard' ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
            <span className="text-[10px] mt-1">{lang === 'bn' ? 'ড্যাশবোর্ড' : 'Home'}</span>
          </button>

          {/* Tab 2: Transactions */}
          <button
            onClick={() => onSelectTab('transactions')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
              activeTab === 'transactions' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ReceiptText size={20} className={activeTab === 'transactions' ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
            <span className="text-[10px] mt-1">{lang === 'bn' ? 'লেনদেন' : 'History'}</span>
          </button>

          {/* Center Floating Plus FAB Button */}
          <div className="relative -top-4 flex items-center justify-center">
            <button
              onClick={() => setShowQuickMenu(!showQuickMenu)}
              className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-950/60 ring-4 ring-[#0d1322] hover:scale-105 active:scale-95 transition"
              title={lang === 'bn' ? 'যোগ করুন' : 'Add'}
            >
              {showQuickMenu ? <X size={24} /> : <Plus size={26} className="stroke-[2.5]" />}
            </button>
          </div>

          {/* Tab 3: Dena-Paona (Debts) */}
          <button
            onClick={() => onSelectTab('debts')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
              activeTab === 'debts' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users size={20} className={activeTab === 'debts' ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
            <span className="text-[10px] mt-1">{lang === 'bn' ? 'দেনা-পাওনা' : 'Debts'}</span>
          </button>

          {/* Tab 4: Analytics */}
          <button
            onClick={() => onSelectTab('analytics')}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
              activeTab === 'analytics' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 size={20} className={activeTab === 'analytics' ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
            <span className="text-[10px] mt-1">{lang === 'bn' ? 'হিসাব/রিপোর্ট' : 'Reports'}</span>
          </button>
        </div>
      </nav>
    </>
  );
};
