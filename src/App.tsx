import React, { useState, useEffect } from 'react';
import { useExpenses } from './hooks/useExpenses';
import { useCategories } from './hooks/useCategories';
import SummaryDashboard from './components/SummaryDashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import CategoryChart from './components/CategoryChart';
import BottomNav, { Tab } from './components/BottomNav';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';
import ExportView from './components/ExportView';
import { WifiOff, CreditCard, UserCircle } from 'lucide-react';

function App() {
  // Get household ID from URL (e.g., ?house=shek-yoyo) or use default
  const houseId = new URLSearchParams(window.location.search).get('house') || 'shek-yoyo-home';
  
  // FIXED: No more getSummary function; summary is now an object
  const { expenses, isLoading, error, addExpense, deleteExpense, summary } = useExpenses(houseId);
  const { categories, addCategory, updateCategory, deleteCategory, getCategoryColor } = useCategories();
  
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Simple toggle for who is currently using the app
  const [currentUser, setCurrentUser] = useState<'Shek' | 'Yoyo'>('Shek');

  const handleAddExpense = (data: any) => {
    // Inject the currentUser so the database knows who paid
    addExpense({ ...data, paid_By: currentUser });
    setIsAddModalOpen(false);
  };

  const renderContent = () => {
    if (isLoading || !summary) {
    return <div className="p-20 text-center text-zinc-500">Syncing...</div>;
  }

    switch (activeTab) {
      case 'home':
        return (
          <div className="animate-fade-in space-y-6">
            <section>
              {/* FIXED: Passing the new summary object */}
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
  return (
    <HistoryView 
      expenses={expenses} 
      getCategoryColor={getCategoryColor} 
      onDelete={deleteExpense} // This allows you to delete directly from history!
    />
  );
      case 'reports':
        return <ExportView expenses={expenses} categories={categories} userNames={['Shek', 'Yoyo']} />;
      case 'settings':
        return (
          <SettingsView 
            categories={categories}
            onAddCategory={addCategory}
            onUpdateCategory={updateCategory}
            onDeleteCategory={deleteCategory}
            userNames={['Shek', 'Yoyo']}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white/20">
      
      {!isAddModalOpen && (
          <div className="px-6 py-6 flex items-center justify-between sticky top-0 z-10 bg-black/80 backdrop-blur-md">
             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800">
                <CreditCard className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-semibold text-zinc-200">House: {houseId}</span>
             </div>
             
             <div className="flex items-center gap-3">
                 <div className="text-right">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Active</div>
                    <div className="text-sm font-bold text-white leading-none">{currentUser}</div>
                 </div>
                 <button 
                    onClick={() => setCurrentUser(prev => prev === 'Shek' ? 'Yoyo' : 'Shek')} 
                    className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-400 hover:text-white transition-all overflow-hidden relative group"
                 >
                    <UserCircle className="w-6 h-6" />
                 </button>
             </div>
          </div>
      )}

      <main className="flex-1 max-w-md w-full mx-auto px-6 relative">
        {error && (
            <div className="bg-red-900/20 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3 mb-6">
                <WifiOff className="w-5 h-5 shrink-0" />
                <div className="text-sm font-medium">{error}</div>
            </div>
        )}

        {isAddModalOpen ? (
            <div className="fixed inset-0 z-50 bg-black">
                <div className="h-full max-w-md mx-auto px-6 py-8">
                    <ExpenseForm 
                        onSubmit={handleAddExpense} 
                        onCancel={() => setIsAddModalOpen(false)}
                        categories={categories} 
                        getCategoryColor={getCategoryColor} 
                        userNames={['Shek', 'Yoyo']}
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