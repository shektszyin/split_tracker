import React, { useState } from 'react';
import { useExpenses } from './hooks/useExpenses';
import { useCategories } from './hooks/useCategories';
import SummaryDashboard from './components/SummaryDashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import CategoryChart from './components/CategoryChart';
import BottomNav, { Tab } from './components/BottomNav';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';
import { WifiOff, CreditCard } from 'lucide-react';

function App() {
  const { expenses, isLoading, error, addExpense, deleteExpense, clearExpenses, summary } = useExpenses();
  const { categories, addCategory, updateCategory, deleteCategory, getCategoryColor } = useCategories();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddExpense = (data: any) => {
    addExpense(data);
    setIsAddModalOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="animate-fade-in space-y-6">
            <section>
              <SummaryDashboard summary={summary} />
            </section>
            
            {expenses.length > 0 && (
                <section>
                    <CategoryChart expenses={expenses} categories={categories} getCategoryColor={getCategoryColor} />
                </section>
            )}

            <section className="pb-32">
              <ExpenseList 
                expenses={expenses.slice(0, 5)} 
                isLoading={isLoading} 
                onDelete={deleteExpense}
                getCategoryColor={getCategoryColor}
              />
            </section>
          </div>
        );
      case 'history':
        return <HistoryView expenses={expenses} getCategoryColor={getCategoryColor} />;
      case 'settings':
        return (
          <SettingsView 
            onClearData={clearExpenses} 
            categories={categories}
            onAddCategory={addCategory}
            onUpdateCategory={updateCategory}
            onDeleteCategory={deleteCategory}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white/20">
      
      {/* Top Header */}
      {!isAddModalOpen && (
          <div className="px-6 py-6 flex items-center justify-between sticky top-0 z-10 bg-black/80 backdrop-blur-md">
             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800">
                <CreditCard className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-semibold text-zinc-200">All Accounts</span>
             </div>
             <button onClick={() => setActiveTab('settings')} className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                 <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-zinc-500 to-zinc-700"></div>
             </button>
          </div>
      )}

      {/* Main Content or Modal */}
      <main className="flex-1 max-w-md w-full mx-auto px-6 relative">
        {error && (
            <div className="bg-red-900/20 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3 mb-6">
                <WifiOff className="w-5 h-5 shrink-0" />
                <div className="text-sm font-medium">{error}</div>
            </div>
        )}

        {/* Add Modal Overlay */}
        {isAddModalOpen ? (
            <div className="fixed inset-0 z-50 bg-black animate-in slide-in-from-bottom-10 duration-300">
                <div className="h-full max-w-md mx-auto px-6 py-8">
                    <ExpenseForm 
                        onSubmit={handleAddExpense} 
                        onCancel={() => setIsAddModalOpen(false)}
                        categories={categories} 
                        getCategoryColor={getCategoryColor} 
                    />
                </div>
            </div>
        ) : (
            renderContent()
        )}

      </main>

      {!isAddModalOpen && (
        <BottomNav 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            onAddClick={() => setIsAddModalOpen(true)}
        />
      )}
    </div>
  );
}

export default App;