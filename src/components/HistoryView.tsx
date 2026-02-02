import React, { useMemo, useState } from 'react';
import { CalendarDays, Trash2, Edit2, PieChart } from 'lucide-react';

interface HistoryViewProps {
  expenses: any[];
  getCategoryColor: (name: string) => string;
  onDelete?: (id: string) => void;
  onEdit: (expense: any) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ expenses = [], getCategoryColor, onDelete, onEdit }) => {
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

  const safeGetColor = typeof getCategoryColor === 'function' 
    ? getCategoryColor 
    : () => '#3f3f46';

  const groupedExpenses = useMemo(() => {
    const groups: Record<string, { expenses: any[]; total: number; categories: Record<string, number> }> = {};
    if (!Array.isArray(expenses)) return [];

    expenses.forEach(expense => {
      const rawDate = expense.created_at || new Date().toISOString();
      const key = viewMode === 'month' ? rawDate.substring(0, 7) : rawDate.substring(0, 4);

      if (!groups[key]) {
        groups[key] = { expenses: [], total: 0, categories: {} };
      }
      groups[key].expenses.push(expense);
      groups[key].total += Number(expense.amount || 0);
      
      // Track category totals for the chart
      const cat = expense.category || 'Other';
      groups[key].categories[cat] = (groups[key].categories[cat] || 0) + Number(expense.amount || 0);
    });

    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [expenses, viewMode]);

  const fmtDate = (dateStr: string) => {
    try {
      if (viewMode === 'year') return dateStr;
      const [year, month] = dateStr.split('-');
      return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch (e) { return "Current Period"; }
  };

  const fmtMoney = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  if (!expenses || expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <CalendarDays className="w-10 h-10 mb-4 opacity-30" />
        <p className="text-sm">No history found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-32">
      <div className="flex items-center justify-between px-2 pt-4">
        <h2 className="text-xl font-bold text-white tracking-tight">History</h2>
        <div className="flex bg-slate-900/50 p-1 rounded-xl ring-1 ring-white/10">
            {['month', 'year'].map((mode) => (
                <button
                    key={mode}
                    onClick={() => setViewMode(mode as 'month' | 'year')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                        viewMode === mode ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500'
                    }`}
                >
                    {mode}
                </button>
            ))}
        </div>
      </div>
      
      {groupedExpenses.map(([key, data]) => (
        <div key={key} className="space-y-6">
          <div className="flex items-end justify-between px-2 pb-2 border-b border-white/5">
            <h3 className="text-sm font-medium text-slate-400">{fmtDate(key)}</h3>
            <span className="text-white font-bold tracking-tight">{fmtMoney(data.total)}</span>
          </div>

          {/* NEW: Category Breakdown Chart for this period */}
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-4 mx-2">
            <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-3 h-3 text-zinc-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Spending Breakdown</span>
            </div>
            
            {/* Visual Progress Bar Chart */}
            <div className="flex h-3 w-full rounded-full overflow-hidden bg-zinc-800 mb-4">
                {Object.entries(data.categories).map(([catName, catAmount]) => (
                    <div 
                        key={catName}
                        style={{ 
                            width: `${(catAmount / data.total) * 100}%`,
                            backgroundColor: safeGetColor(catName)
                        }}
                        className="h-full transition-all duration-500"
                    />
                ))}
            </div>

            {/* Legend Labels */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {Object.entries(data.categories).map(([catName, catAmount]) => (
                    <div key={catName} className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: safeGetColor(catName) }} />
                            <span className="text-zinc-400 font-bold truncate">{catName}</span>
                        </div>
                        <span className="text-zinc-500 font-medium">{Math.round((catAmount / data.total) * 100)}%</span>
                    </div>
                ))}
            </div>
          </div>
          
          <div className="space-y-2">
            {data.expenses.map(expense => (
              <div key={expense.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                   <div className="w-1.5 h-8 rounded-full opacity-60" style={{ backgroundColor: safeGetColor(expense.category || 'Other') }} />
                   <div>
                       <div className="text-slate-200 text-sm font-medium">{expense.name || 'Untitled'}</div>
                       <div className="flex items-center gap-2">
                          <span className="text-[10px] text-zinc-500 uppercase font-bold">{expense.paid_by || 'Unknown'}</span>
                          <span className="text-[10px] text-slate-600">•</span>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                            {new Date(expense.created_at || Date.now()).toLocaleDateString(undefined, {day: 'numeric', month: 'short'})}
                          </span>
                       </div>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-slate-200 font-bold text-sm mr-2">
                    {fmtMoney(Number(expense.amount || 0))}
                  </div>
                  <button
                    onClick={(e) => { e.preventDefault(); onEdit(expense); }}
                    className="p-1 text-zinc-600 hover:text-blue-400 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {typeof onDelete === 'function' && (
                    <button 
                      onClick={(e) => { e.preventDefault(); onDelete(expense.id); }} 
                      className="p-1 text-zinc-600 hover:text-red-400 opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
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