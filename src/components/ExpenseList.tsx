import React from 'react';
import { Expense } from '../types';
import { Trash2, Loader2, Compass } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  isLoading?: boolean;
  onDelete: (id: string) => void;
  getCategoryColor: (name: string) => string;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, isLoading = false, onDelete, getCategoryColor }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin mb-2" />
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 opacity-50">
        <Compass className="w-12 h-12 text-zinc-600 mb-4" strokeWidth={1} />
        <p className="text-zinc-500 text-sm font-medium">No transactions for this period</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2 mt-8 mb-2">
        <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Recent</h3>
      </div>
      
      <div className="space-y-1">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="group flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-900 transition-colors cursor-default"
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-black"
                style={{ backgroundColor: getCategoryColor(expense.category) }}
              >
                {expense.category.charAt(0)}
              </div>
              
              <div className="flex flex-col">
                <span className="text-zinc-100 font-medium text-base">{expense.name}</span>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span>{new Date(expense.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                    <span>•</span>
                    <span className={expense.paidBy === 'User A' ? 'text-emerald-500' : 'text-orange-500'}>
                        {expense.paidBy}
                    </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-white font-semibold text-base tracking-tight">
                  ${expense.amount.toFixed(2)}
                </span>
                <button
                  onClick={(e) => {
                      e.stopPropagation();
                      onDelete(expense.id);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;