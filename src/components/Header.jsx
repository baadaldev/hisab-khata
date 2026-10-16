import React from 'react';
import { Settings, Globe, Calendar, Sparkles } from 'lucide-react';
import { MONTH_NAMES_BN, MONTH_NAMES_EN } from '../constants/initialData';
import { toBnDigit } from '../utils/helpers';

export const Header = ({ 
  selectedMonth, 
  onSelectMonth, 
  availableMonths, 
  onOpenSettings, 
  lang, 
  onToggleLang 
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/30">
            <span className="text-xl font-black text-white leading-none">৳</span>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-none flex items-center gap-1.5">
              <span>{lang === 'bn' ? 'হিসাব খাতা' : 'Hisab Khata'}</span>
            </h1>
            <span className="text-[10px] text-emerald-400 font-medium block">
              {lang === 'bn' ? 'ব্যক্তিগত খরচ ও ধার দেনা' : 'Expense & Debt Tracker'}
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Month Selector */}
          <div className="relative hidden sm:block">
            <select
              value={selectedMonth}
              onChange={(e) => onSelectMonth(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 text-white text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="">{lang === 'bn' ? 'সকল মাস' : 'All Months'}</option>
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

          {/* Language Switch */}
          <button
            onClick={onToggleLang}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-1"
            title={lang === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
          >
            <Globe size={13} className="text-emerald-400" />
            <span>{lang === 'bn' ? 'EN' : 'বাং'}</span>
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition"
            title={lang === 'bn' ? 'সেটিংস ও ব্যাকআপ' : 'Settings & Backup'}
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
