import React from 'react';
import { Calendar, Scale } from 'lucide-react';

// Simplified interface to match the new useExpenses summary object
interface SummaryDashboardProps {
  summary: {
    total: number;
    totalA: number; // Shek's total
    totalB: number; // Yoyo's total
    settlement: {
      debtor: string;
      creditor: string;
      amount: number;
    };
  };
}

const SummaryDashboard: React.FC<SummaryDashboardProps> = ({ summary }) => {
  const { total, totalA, totalB, settlement } = summary;

  const fmt = (num: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(num);

  const fmtDetailed = (num: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);

  return (
    <div className="flex flex-col items-center pt-8 pb-4">
      {/* Date Pill */}
      <div className="flex items-center gap-2 bg-zinc-900 rounded-full px-4 py-1.5 mb-6 border border-zinc-800">
        <Calendar className="w-3 h-3 text-zinc-400" />
        <span className="text-xs font-medium text-zinc-300">Live Sync Active</span>
      </div>

      {/* Main Balance */}
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold tracking-tighter text-white mb-2">{fmt(total)}</h1>
        <div className="text-zinc-500 text-sm font-medium tracking-wide">Total Combined Spending</div>
      </div>

      {/* Split Indicators - Specifically for Shek and Yoyo */}
      <div className="grid grid-cols-2 gap-4 w-full mb-8">
        <div className="bg-zinc-900/30 rounded-2xl p-4 flex flex-col items-center border border-zinc-800/50">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Shek Paid</span>
            </div>
            <span className="text-lg font-semibold text-zinc-200">{fmt(totalA)}</span>
        </div>

        <div className="bg-zinc-900/30 rounded-2xl p-4 flex flex-col items-center border border-zinc-800/50">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Yoyo Paid</span>
            </div>
            <span className="text-lg font-semibold text-zinc-200">{fmt(totalB)}</span>
        </div>
      </div>

      {/* Settlement Card */}
      {settlement.amount > 0.01 ? (
        <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-blue-400 mb-0.5">
                    <Scale className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Who owes who?</span>
                </div>
                <div className="text-sm text-zinc-300">
                    <span className="text-white font-semibold">{settlement.debtor}</span> owes <span className="text-white font-semibold">{settlement.creditor}</span>
                </div>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
                {fmtDetailed(settlement.amount)}
            </div>
        </div>
      ) : (
         <div className="flex items-center gap-2 opacity-40">
            <CheckCircle className="w-4 h-4 text-zinc-500" />
            <span className="text-xs font-medium text-zinc-500">Everything is settled up</span>
         </div>
      )}
    </div>
  );
};

const CheckCircle = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

export default SummaryDashboard;