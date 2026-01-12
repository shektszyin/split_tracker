import React, { useState, useMemo } from 'react';
import { Printer, Filter } from 'lucide-react';

interface ExportViewProps {
  expenses: any[];
  categories: any[];
  userNames: string[];
}

const ExportView: React.FC<ExportViewProps> = ({ expenses, categories, userNames }) => {
  const [filterUser, setFilterUser] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      // 1. FIX: Use 'paid_by' to match Supabase
      const userMatch = filterUser === 'All' || e.paid_by === filterUser;
      
      // 2. FIX: Ensure category comparison is safe
      const catMatch = filterCategory === 'All' || e.category === filterCategory;
      
      // 3. FIX: Use 'created_at' for date filtering
      const expenseDate = new Date(e.created_at);
      const startMatch = !startDate || expenseDate >= new Date(startDate);
      const endMatch = !endDate || expenseDate <= new Date(endDate + 'T23:59:59');
      
      return userMatch && catMatch && startMatch && endMatch;
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [expenses, filterUser, filterCategory, startDate, endDate]);

  const totalFiltered = filteredExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in pt-4 pb-32 print:p-0">
      {/* Header */}
      <div className="flex items-center justify-between px-2 print:hidden">
        <h2 className="text-xl font-bold text-white tracking-tight">Reports</h2>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-zinc-200"
        >
          <Printer className="w-3.5 h-3.5" />
          Print
        </button>
      </div>

      {/* Filters Card */}
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
                    className="w-full bg-zinc-800 border-none rounded-xl px-3 py-2 text-sm text-white"
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
                    className="w-full bg-zinc-800 border-none rounded-xl px-3 py-2 text-sm text-white"
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
            {filteredExpenses.length} Records
         </div>
         <div className="text-right">
            <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Total Selection</div>
            <div className="text-2xl font-black text-white">${totalFiltered.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
         </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden print:border-none">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-zinc-800 text-[10px] font-bold uppercase text-zinc-500">
                        <th className="px-4 py-4">Date</th>
                        <th className="px-4 py-4">Item</th>
                        <th className="px-4 py-4">Payer</th>
                        <th className="px-4 py-4 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                    {filteredExpenses.map((exp) => (
                        <tr key={exp.id} className="hover:bg-zinc-800/30 transition-colors print:text-black">
                            <td className="px-4 py-4 text-zinc-400 whitespace-nowrap">
                                {new Date(exp.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
                            </td>
                            <td className="px-4 py-4">
                                <div className="text-white font-semibold print:text-black">{exp.name}</div>
                                <div className="text-[10px] text-zinc-500 uppercase">{exp.category}</div>
                            </td>
                            <td className="px-4 py-4 text-zinc-300 font-bold">{exp.paid_by}</td>
                            <td className="px-4 py-4 text-right font-black text-white">
                                ${Number(exp.amount).toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default ExportView;