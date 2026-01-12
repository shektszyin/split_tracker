import React, { useState, useEffect } from 'react';
import { useExpenses } from './hooks/useExpenses';
import { useCategories } from './hooks/useCategories';
import { useUserNames } from './hooks/useUserNames';
import SummaryDashboard from './components/SummaryDashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import CategoryChart from './components/CategoryChart';
import BottomNav, { Tab } from './components/BottomNav';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';
import ExportView from './components/ExportView';
import LoginScreen from './components/LoginScreen';
import { WifiOff, CreditCard, UserCircle } from 'lucide-react';

function App() {
  const { expenses, isLoading, error, addExpense, deleteExpense, clearExpenses, getSummary, renameUserInExpenses } = useExpenses();
  const { categories, addCategory, updateCategory, deleteCategory, getCategoryColor } = useCategories();
  const { userNames, updateUserName } = useUserNames();
  
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Load session user if exists
  useEffect(() => {
    const saved = sessionStorage.getItem('fairshare_current_user');
    if (saved) setCurrentUser(saved);
  }, []);

  const handleSelectUser = (name: string) => {
    setCurrentUser(name);
    sessionStorage.setItem('fairshare_current_user', name);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('fairshare_current_user');
  };

  const summary = getSummary(userNames);

  const handleAddExpense = (data: any) => {
    addExpense(data);
    setIsAddModalOpen(false);
  };

  const handleUpdateUserName = (index: number, newName: string) => {
    const oldName = userNames[index];
    updateUserName(index, newName);
    if (oldName !== newName) {
        renameUserInExpenses(oldName, newName);
        if (currentUser === oldName) {
            handleSelectUser(newName);
        }
    }
  };

  if (!currentUser) {
    return <LoginScreen userNames={userNames} onSelectUser={handleSelectUser} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="animate-fade-in space-y-6">
            <section>
              <SummaryDashboard summary={summary} userNames={userNames} />
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
      case 'reports':
        return <ExportView expenses={expenses} categories={categories} userNames={userNames} />;
      case 'settings':
        return (
          <SettingsView 
            onClearData={clearExpenses} 
            categories={categories}
            onAddCategory={addCategory}
            onUpdateCategory={updateCategory}
            onDeleteCategory={deleteCategory}
            userNames={userNames}
            onUpdateUserName={handleUpdateUserName}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white/20">
      
      {/* Top Header - Hidden on Print */}
      {!isAddModalOpen && (
          <div className="px-6 py-6 flex items-center justify-between sticky top-0 z-10 bg-black/80 backdrop-blur-md print:hidden">
             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800">
                <CreditCard className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-semibold text-zinc-200">Shared Tracker</span>
             </div>
             
             <div className="flex items-center gap-3">
                 <div className="text-right">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Active</div>
                    <div className="text-sm font-bold text-white leading-none">{currentUser}</div>
                 </div>
                 <button 
                    onClick={handleLogout} 
                    className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all overflow-hidden relative group"
                 >
                    <UserCircle className="w-6 h-6" />
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 </button>
             </div>
          </div>
      )}

      {/* Main Content or Modal */}
      <main className="flex-1 max-w-md w-full mx-auto px-6 relative print:px-0 print:max-w-none">
        {error && (
            <div className="bg-red-900/20 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3 mb-6 print:hidden">
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
                        userNames={userNames}
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