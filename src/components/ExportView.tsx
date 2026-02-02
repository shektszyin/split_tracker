import React, { useMemo, useState } from 'react';
import { Printer, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface ExportViewProps {
  expenses: any[];
  categories: any[];
  userNames: string[];
}

const ExportView: React.FC<ExportViewProps> = ({ expenses, categories, userNames }) => {
  // State to manage which month we are viewing
  const [viewDate, setViewDate] = useState(new Date());
  
  const selectedMonth = viewDate.toISOString().slice(0, 7);
  const selectedMonthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const changeMonth = (offset: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setViewDate(newDate);
  };

  // Filter and calculate data for the receipt based on the selected month
  const reportData = useMemo(() => {
    const filtered = expenses.filter(e => e.month === selectedMonth);
    
    const totalA = filtered.filter(e => e.paid_by === 'Shek').reduce((sum, e) => sum + Number(e.amount), 0);
    const totalB = filtered.filter(e => e.paid_by === 'Yoyo').reduce((sum, e) => sum + Number(e.amount), 0);
    const total = totalA + totalB;
    
    const diff = Math.abs(totalA - totalB) / 2;
    const debtor = totalA < totalB ? 'Shek' : 'Yoyo';
    const creditor = totalA < totalB ? 'Yoyo' : 'Shek';

    return { filtered, totalA, totalB, total, diff, debtor, creditor };
  }, [expenses, selectedMonth]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-32 animate-fade-in">
      {/* Header & Month Selector */}
      <div className="space-y-4 print:hidden px-2 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Monthly Report</h2>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl font-bold text-sm hover:bg-zinc-200 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </button>
        </div>

        {/* Month Navigation Control */}
        <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-2xl p-2">
            <button 
                onClick={() => changeMonth(-1)}
                className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 font-bold text-zinc-200">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>{selectedMonthName}</span>
            </div>
            <button 
                onClick={() => changeMonth(1)}
                className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 transition-colors"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* THE RECEIPT */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-zinc-300 shadow-2xl print:bg-white print:text-black print:border-none print:p-0">
        
        {/* Receipt Header */}
        <div className="text-center border-b border-zinc-800 pb-6 mb-6 print:border-zinc-200">
          <h3 className="text-white text-2xl font-black uppercase tracking-tighter mb-1 print:text-black">Expense Statement</h3>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{selectedMonthName}</p>
        </div>

        {/* Summary Section */}
        <div className="space-y-3 mb-8 bg-zinc-800/30 p-6 rounded-2xl border border-zinc-800/50 print:bg-zinc-50 print:border-zinc-100">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 font-medium">Total Combined Spending</span>
            <span className="font-bold text-white print:text-black">${reportData.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 font-medium">Shek Paid Total</span>
            <span className="font-bold text-emerald-500">${reportData.totalA.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 font-medium">Yoyo Paid Total</span>
            <span className="font-bold text-orange-500">${reportData.totalB.toFixed(2)}</span>
          </div>
          <div className="pt-4 mt-2 border-t border-zinc-800 print:border-zinc-200 flex justify-between items-center">
            <span className="text-blue-400 font-bold text-[10px] uppercase tracking-[0.2em]">Final Settlement</span>
            <span className="text-lg font-black text-white print:text-black">
              {reportData.total > 0 ? `${reportData.debtor} owes ${reportData.creditor} $${reportData.diff.toFixed(2)}` : 'No expenses'}
            </span>
          </div>
        </div>

        {/* Details Table */}
        <div>
          <h4 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-zinc-700 rounded-full"></span>
              Transaction Breakdown
          </h4>
          <div className="space-y-4">
            {reportData.filtered.length > 0 ? (
                reportData.filtered.map((expense) => (
                    <div key={expense.id} className="flex justify-between items-start text-sm border-b border-zinc-800/50 pb-3 last:border-0 print:border-zinc-100">
                      <div>
                        <div className="font-bold text-zinc-200 print:text-black">{expense.name}</div>
                        <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-tight">
                          {new Date(expense.created_at).toLocaleDateString()} • {expense.paid_by}
                        </div>
                      </div>
                      <div className="font-bold text-zinc-100 print:text-black">
                        ${Number(expense.amount).toFixed(2)}
                      </div>
                    </div>
                  ))
            ) : (
                <div className="text-center py-8 text-zinc-600 text-sm font-medium italic">
                    No transactions recorded for this month.
                </div>
            )}
          </div>
        </div>

        <div className="mt-12 text-center text-[10px] text-zinc-600 uppercase font-bold tracking-[0.3em]">
          Generated via Split Tracker • {new Date().toLocaleString()}
        </div>
      </div>

      {/* PRINT CSS STYLES */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:bg-white, .print\\:bg-white * {
            visibility: visible;
          }
          .print\\:bg-white {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ExportView;