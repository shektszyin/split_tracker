import React, { useMemo, useState } from 'react';
import { Expense } from '../types';
import { CalendarDays } from 'lucide-react';

interface HistoryViewProps {
  expenses: Expense[];
  getCategoryColor: (name: string) => string;
}

const HistoryView: React.FC<HistoryViewProps> = ({ expenses, getCategoryColor }) => {
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

  const groupedExpenses = useMemo(() => {
    const groups: Record<string, { expenses: Expense[]; total: number }> = {};
    
    expenses.forEach(expense => {
      const key = viewMode === 'month' 
        ? expense.date.substring(0, 7) 
        : expense.date.substring(0, 4);

      if (!groups[key]) {
        groups[key] = { expenses: [], total: 0 };
      }
      groups[key].expenses.push(expense);
      groups[key].total += expense.amount;
    });

    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [expenses, viewMode]);

  const fmtDate = (dateStr: string) => {
    if (viewMode === 'year') return dateStr;
    const [year, month] = dateStr.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const fmtMoney = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <CalendarDays className="w-10 h-10 mb-4 opacity-30" />
        <p className="text-sm">No history yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-bold text-white tracking-tight">History</h2>
        
        {/* Minimal Toggle */}
        <div className="flex bg-slate-900/50 p-1 rounded-xl ring-1 ring-white/10">
            {['month', 'year'].map((mode) => (
                <button
                    key={mode}
                    onClick={() => setViewMode(mode as 'month' | 'year')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                        viewMode === mode
                        ? 'bg-slate-800 text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                >
                    {mode}
                </button>
            ))}
        </div>
      </div>
      
      {groupedExpenses.map(([key, data]) => (
        <div key={key} className="space-y-3">
          <div className="flex items-end justify-between px-2 pb-2 border-b border-white/5">
            <h3 className="text-sm font-medium text-slate-400">{fmtDate(key)}</h3>
            <span className="text-white font-bold tracking-tight">{fmtMoney(data.total)}</span>
          </div>
          
          <div className="space-y-2">
            {data.expenses.map(expense => (
              <div key={expense.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                   <div className="w-1 h-8 rounded-full opacity-60" style={{ backgroundColor: getCategoryColor(expense.category) }} />
                   <div>
                       <div className="text-slate-200 text-sm font-medium">{expense.name}</div>
                       <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                          {new Date(expense.date).toLocaleDateString(undefined, {day: 'numeric', month: 'short'})}
                       </div>
                   </div>
                </div>
                <div className="text-slate-300 font-medium text-sm">
                  {fmtMoney(expense.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryView;
