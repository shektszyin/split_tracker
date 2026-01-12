import React, { useState, useMemo } from 'react';
import { Expense, CategoryItem } from '../types';
import { Printer, Filter, Download, Search, Calendar, ChevronDown } from 'lucide-react';

interface ExportViewProps {
  expenses: Expense[];
  categories: CategoryItem[];
  userNames: string[];
}

const ExportView: React.FC<ExportViewProps> = ({ expenses, categories, userNames }) => {
  const [filterUser, setFilterUser] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const userMatch = filterUser === 'All' || e.paidBy === filterUser;
      const catMatch = filterCategory === 'All' || e.category === filterCategory;
      const startMatch = !startDate || new Date(e.date) >= new Date(startDate);
      const endMatch = !endDate || new Date(e.date) <= new Date(endDate + 'T23:59:59');
      return userMatch && catMatch && startMatch && endMatch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, filterUser, filterCategory, startDate, endDate]);

  const totalFiltered = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in pt-4 pb-32 print:p-0">
      {/* Header - Hidden on Print */}
      <div className="flex items-center justify-between px-2 print:hidden">
        <h2 className="text-xl font-bold text-white tracking-tight">Data Reports</h2>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-zinc-200 active:scale-95 transition-all"
        >
          <Printer className="w-3.5 h-3.5" />
          Print Records
        </button>
      </div>

      {/* Filters Card - Hidden on Print */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-5 space-y-4 print:hidden">
        <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Filter className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Filters</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-bold uppercase ml-1">Paid By</label>
                <select 
                    value={filterUser} 
                    onChange={e => setFilterUser(e.target.value)}
                    className="w-full bg-zinc-800 border-none rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-white/20"
                >
                    <option value="All">All Users</option>
                    {userNames.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
            </div>
            <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-bold uppercase ml-1">Category</label>
                <select 
                    value={filterCategory} 
                    onChange={e => setFilterCategory(e.target.value)}
                    className="w-full bg-zinc-800 border-none rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-white/20"
                >
                    <option value="All">All Categories</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-bold uppercase ml-1">From</label>
                <input 
                    type="date" 
                    value={startDate} 
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-zinc-800 border-none rounded-xl px-3 py-2 text-sm text-white"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-bold uppercase ml-1">To</label>
                <input 
                    type="date" 
                    value={endDate} 
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full bg-zinc-800 border-none rounded-xl px-3 py-2 text-sm text-white"
                />
            </div>
        </div>
      </div>

      {/* Summary Row */}
      <div className="flex items-center justify-between px-2">
         <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
            {filteredExpenses.length} Records found
         </div>
         <div className="text-right">
            <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Total Selection</div>
            <div className="text-2xl font-black text-white">${totalFiltered.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
         </div>
      </div>

      {/* Table Content */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden print:border-none print:bg-transparent">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
                <thead>
                    <tr className="border-b border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-500 print:text-black">
                        <th className="px-4 py-4">Date</th>
                        <th className="px-4 py-4">Description</th>
                        <th className="px-4 py-4">Payer</th>
                        <th className="px-4 py-4 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 print:divide-zinc-200">
                    {filteredExpenses.map((exp) => (
                        <tr key={exp.id} className="hover:bg-zinc-800/30 transition-colors print:text-black">
                            <td className="px-4 py-4 text-zinc-400 font-medium whitespace-nowrap print:text-black">
                                {new Date(exp.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
                            </td>
                            <td className="px-4 py-4">
                                <div className="text-white font-semibold print:text-black">{exp.name}</div>
                                <div className="text-[10px] text-zinc-500 uppercase font-bold print:text-zinc-600">{exp.category}</div>
                            </td>
                            <td className="px-4 py-4 font-bold text-zinc-300 print:text-black">
                                {exp.paidBy}
                            </td>
                            <td className="px-4 py-4 text-right font-black text-white tabular-nums print:text-black">
                                ${exp.amount.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                    {filteredExpenses.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-4 py-12 text-center text-zinc-600 font-medium">
                                No records match the current filters.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Print-only CSS */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .print-hidden { display: none !important; }
          #root > div { background: white !important; }
          table { width: 100% !important; }
          th { border-bottom: 2px solid black !important; }
          td { border-bottom: 1px solid #eee !important; padding: 12px 0 !important; }
          @page { margin: 2cm; }
        }
      `}</style>
    </div>
  );
};

export default ExportView;