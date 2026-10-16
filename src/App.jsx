import React, { useState, useEffect, useMemo } from 'react';
import { 
  DEMO_TRANSACTIONS, 
  DEMO_DEBTS 
} from './constants/initialData';
import { 
  STORAGE_KEYS, 
  loadFromStorage, 
  saveToStorage 
} from './utils/helpers';

// Components
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { DenaPaona } from './components/DenaPaona';
import { Analytics } from './components/Analytics';
import { TransactionModal } from './components/TransactionModal';
import { DebtModal } from './components/DebtModal';
import { RepaymentModal } from './components/RepaymentModal';
import { SettingsModal } from './components/SettingsModal';

export function App() {
  // 1. Core State with LocalStorage Persistence
  const [transactions, setTransactions] = useState(() => 
    loadFromStorage(STORAGE_KEYS.TRANSACTIONS, DEMO_TRANSACTIONS)
  );

  const [debts, setDebts] = useState(() => 
    loadFromStorage(STORAGE_KEYS.DEBTS, DEMO_DEBTS)
  );

  const [lang, setLang] = useState(() => 
    loadFromStorage(STORAGE_KEYS.LANG, 'bn')
  );

  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Selected month format: YYYY-MM
  const [selectedMonth, setSelectedMonth] = useState(() => 
    new Date().toISOString().slice(0, 7)
  );

  // Modals state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState(null);

  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);
  const [repayingDebt, setRepayingDebt] = useState(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
  }, [transactions]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DEBTS, debts);
  }, [debts]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.LANG, lang);
  }, [lang]);

  // Available unique months
  const availableMonths = useMemo(() => {
    const set = new Set();
    transactions.forEach(t => {
      if (t.date) set.add(t.date.slice(0, 7));
    });
    set.add(new Date().toISOString().slice(0, 7));
    return Array.from(set).sort().reverse();
  }, [transactions]);

  // Transaction Handlers
  const handleOpenAddTxModal = (initialType = 'expense') => {
    setEditingTx({ type: initialType });
    setIsTxModalOpen(true);
  };

  const handleOpenEditTxModal = (tx) => {
    setEditingTx(tx);
    setIsTxModalOpen(true);
  };

  const handleSaveTransaction = (txData) => {
    setTransactions(prev => {
      const idx = prev.findIndex(t => t.id === txData.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = txData;
        return updated;
      }
      return [txData, ...prev];
    });
  };

  const handleDeleteTransaction = (txId) => {
    setTransactions(prev => prev.filter(t => t.id !== txId));
  };

  // Debt Handlers
  const handleOpenAddDebtModal = () => {
    setEditingDebt(null);
    setIsDebtModalOpen(true);
  };

  const handleOpenEditDebtModal = (debt) => {
    setEditingDebt(debt);
    setIsDebtModalOpen(true);
  };

  const handleSaveDebt = (debtData) => {
    setDebts(prev => {
      const idx = prev.findIndex(d => d.id === debtData.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = debtData;
        return updated;
      }
      return [debtData, ...prev];
    });
  };

  const handleDeleteDebt = (debtId) => {
    setDebts(prev => prev.filter(d => d.id !== debtId));
  };

  // Repayment Handlers
  const handleOpenRepayModal = (debt) => {
    setRepayingDebt(debt);
    setIsRepayModalOpen(true);
  };

  const handleAddRepayment = (debtId, repaymentObj, willBeSettled) => {
    setDebts(prev => prev.map(d => {
      if (d.id === debtId) {
        const currentReps = d.repayments || [];
        return {
          ...d,
          repayments: [...currentReps, repaymentObj],
          status: willBeSettled ? 'settled' : d.status,
        };
      }
      return d;
    }));

    // Also update repayment modal current debt
    setRepayingDebt(prev => {
      if (prev && prev.id === debtId) {
        return {
          ...prev,
          repayments: [...(prev.repayments || []), repaymentObj],
          status: willBeSettled ? 'settled' : prev.status,
        };
      }
      return prev;
    });
  };

  const handleDeleteRepayment = (debtId, repId) => {
    setDebts(prev => prev.map(d => {
      if (d.id === debtId) {
        const updatedReps = (d.repayments || []).filter(r => r.id !== repId);
        const totalPaid = updatedReps.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
        const shouldBeActive = totalPaid < (Number(d.originalAmount) || 0);
        return {
          ...d,
          repayments: updatedReps,
          status: shouldBeActive ? 'active' : d.status,
        };
      }
      return d;
    }));

    setRepayingDebt(prev => {
      if (prev && prev.id === debtId) {
        const updatedReps = (prev.repayments || []).filter(r => r.id !== repId);
        return {
          ...prev,
          repayments: updatedReps,
        };
      }
      return prev;
    });
  };

  const handleToggleDebtStatus = (debtId) => {
    setDebts(prev => prev.map(d => {
      if (d.id === debtId) {
        return {
          ...d,
          status: d.status === 'settled' ? 'active' : 'settled',
        };
      }
      return d;
    }));
    setIsRepayModalOpen(false);
  };

  // Data management
  const handleRestoreData = (newTx, newDebts) => {
    setTransactions(newTx);
    setDebts(newDebts);
  };

  const handleResetData = () => {
    setTransactions([]);
    setDebts([]);
  };

  const handleLoadDemoData = () => {
    setTransactions(DEMO_TRANSACTIONS);
    setDebts(DEMO_DEBTS);
  };

  const handleToggleLang = () => {
    setLang(prev => (prev === 'bn' ? 'en' : 'bn'));
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white pb-24">
      {/* Top Header */}
      <Header
        selectedMonth={selectedMonth}
        onSelectMonth={setSelectedMonth}
        availableMonths={availableMonths}
        onOpenSettings={() => setIsSettingsOpen(true)}
        lang={lang}
        onToggleLang={handleToggleLang}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            transactions={transactions}
            debts={debts}
            selectedMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
            onNavigateTab={setActiveTab}
            onOpenAddTxModal={handleOpenAddTxModal}
            onOpenAddDebtModal={handleOpenAddDebtModal}
            lang={lang}
          />
        )}

        {activeTab === 'transactions' && (
          <Transactions
            transactions={transactions}
            onOpenAddModal={() => handleOpenAddTxModal('expense')}
            onOpenEditModal={handleOpenEditTxModal}
            onDeleteTransaction={handleDeleteTransaction}
            selectedMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
            lang={lang}
          />
        )}

        {activeTab === 'debts' && (
          <DenaPaona
            debts={debts}
            onOpenAddModal={handleOpenAddDebtModal}
            onOpenEditModal={handleOpenEditDebtModal}
            onOpenRepayModal={handleOpenRepayModal}
            onDeleteDebt={handleDeleteDebt}
            lang={lang}
          />
        )}

        {activeTab === 'analytics' && (
          <Analytics
            transactions={transactions}
            selectedMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
            lang={lang}
          />
        )}
      </main>

      {/* Mobile-Friendly Bottom Nav Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAddTxModal={handleOpenAddTxModal}
        onOpenAddDebtModal={handleOpenAddDebtModal}
        lang={lang}
      />

      {/* Modals */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSave={handleSaveTransaction}
        editingTx={editingTx}
        lang={lang}
      />

      <DebtModal
        isOpen={isDebtModalOpen}
        onClose={() => setIsDebtModalOpen(false)}
        onSave={handleSaveDebt}
        editingDebt={editingDebt}
        lang={lang}
      />

      <RepaymentModal
        isOpen={isRepayModalOpen}
        onClose={() => setIsRepayModalOpen(false)}
        debt={repayingDebt}
        onAddRepayment={handleAddRepayment}
        onDeleteRepayment={handleDeleteRepayment}
        onToggleStatus={handleToggleDebtStatus}
        lang={lang}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        transactions={transactions}
        debts={debts}
        onRestoreData={handleRestoreData}
        onResetData={handleResetData}
        onLoadDemoData={handleLoadDemoData}
        lang={lang}
        onToggleLang={handleToggleLang}
      />
    </div>
  );
}

export default App;
