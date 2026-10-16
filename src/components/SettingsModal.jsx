import React, { useRef } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  Trash2, 
  RefreshCw, 
  Smartphone, 
  Globe, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { downloadBackupJSON, downloadCSV } from '../utils/helpers';

export const SettingsModal = ({ 
  isOpen, 
  onClose, 
  transactions, 
  debts, 
  onRestoreData, 
  onResetData, 
  onLoadDemoData, 
  lang, 
  onToggleLang 
}) => {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (json.transactions && Array.isArray(json.transactions) && json.debts && Array.isArray(json.debts)) {
          onRestoreData(json.transactions, json.debts);
          alert(lang === 'bn' ? 'ডাটা সফলভাবে রিস্টোর হয়েছে!' : 'Data restored successfully!');
          onClose();
        } else {
          alert(lang === 'bn' ? 'ফাইলটির ফরম্যাট সঠিক নয়।' : 'Invalid backup file format.');
        }
      } catch (err) {
        alert(lang === 'bn' ? 'ফাইল পড়তে ব্যর্থ হয়েছে।' : 'Failed to read file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full sm:max-w-lg bg-[#111726] border border-slate-700/60 rounded-t-3xl sm:rounded-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>{lang === 'bn' ? 'সেটিংস ও ডাটা ব্যাকআপ' : 'Settings & Data Backup'}</span>
          </h3>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* Language Switcher */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Globe size={18} className="text-emerald-400" />
              <div>
                <span className="text-xs font-semibold text-white block">
                  {lang === 'bn' ? 'অ্যাপের ভাষা (Language)' : 'App Language'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {lang === 'bn' ? 'বাংলা ও ইংরেজির মধ্যে পরিবর্তন করুন' : 'Switch between Bengali & English'}
                </span>
              </div>
            </div>

            <button
              onClick={onToggleLang}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-emerald-400 transition"
            >
              {lang === 'bn' ? '🇧🇩 বাংলা' : '🇬🇧 English'}
            </button>
          </div>

          {/* Backup & Export Options */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {lang === 'bn' ? 'ডাটা সংরক্ষণ ও ব্যাকআপ' : 'Data Backup & Export'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => downloadBackupJSON(transactions, debts)}
                className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 text-left transition flex items-center gap-2.5 group"
              >
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition">
                  <Download size={16} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">
                    {lang === 'bn' ? 'JSON ব্যাকআপ ডাউনলোড' : 'Download Backup'}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {lang === 'bn' ? 'ফোনে সেভ করে রাখুন' : 'Save full data offline'}
                  </span>
                </div>
              </button>

              <button
                onClick={() => downloadCSV(transactions, debts, lang)}
                className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 text-left transition flex items-center gap-2.5 group"
              >
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition">
                  <FileSpreadsheet size={16} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">
                    {lang === 'bn' ? 'Excel / CSV এক্সপোর্ট' : 'Export to CSV'}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {lang === 'bn' ? 'এক্সেল শীটে দেখার জন্য' : 'Open in Excel/Sheets'}
                  </span>
                </div>
              </button>
            </div>

            {/* Restore File */}
            <div className="pt-1">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-3 rounded-xl bg-slate-900/40 border border-dashed border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-white transition flex items-center justify-center gap-2 text-xs font-semibold"
              >
                <Upload size={16} className="text-emerald-400" />
                <span>{lang === 'bn' ? 'পুরোনো ব্যাকআপ ফাইল আপলোড করে রিস্টোর করুন' : 'Restore from JSON Backup File'}</span>
              </button>
            </div>
          </div>

          {/* PWA Phone Installation Guide */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400">
              <Smartphone size={18} />
              <span className="text-xs font-bold">
                {lang === 'bn' ? 'ফোনে অ্যাপের মতো ব্যবহার করার নিয়ম' : 'How to install as Mobile App'}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'bn' ? (
                <>
                  আপনার ফোন ব্রাউজার (Chrome / Safari) থেকে <strong>থ্রি-ডট মেনু (⋮)</strong> অথবা <strong>Share বাটন</strong> চাপুন, তারপর <strong>"Add to Home screen" (হোম স্ক্রিনে যোগ করুন)</strong> চাপলে এটি আপনার ফোনের অ্যাপ লিস্টে যুক্ত হয়ে যাবে এবং সম্পূর্ণ অফলাইনেও কাজ করবে!
                </>
              ) : (
                <>
                  From your phone's browser (Chrome or Safari), tap the <strong>Menu (⋮)</strong> or <strong>Share icon</strong>, then select <strong>"Add to Home Screen"</strong>. It will work just like a native app and operate fully offline!
                </>
              )}
            </p>
          </div>

          {/* Reset & Demo Controls */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  if (confirm(lang === 'bn' ? 'ডেমো ডাটা লোড করবেন? এতে বর্তমান নমুনা তথ্য লোড হবে।' : 'Load sample demo data?')) {
                    onLoadDemoData();
                    onClose();
                  }
                }}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white transition flex items-center gap-1.5"
              >
                <RefreshCw size={13} className="text-emerald-400" />
                <span>{lang === 'bn' ? 'ডেমো ডাটা লোড' : 'Load Demo Data'}</span>
              </button>

              <button
                onClick={() => {
                  if (confirm(lang === 'bn' ? 'সতর্কতা: আপনার সকল লেনদেন এবং দেনা-পাওনার ডাটা মুছে যাবে! আপনি কি নিশ্চিত?' : 'Warning: All transactions and debts will be permanently cleared! Are you sure?')) {
                    onResetData();
                    onClose();
                  }
                }}
                className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 hover:bg-rose-500/20 transition flex items-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>{lang === 'bn' ? 'সকল ডাটা মুছুন' : 'Clear All Data'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
