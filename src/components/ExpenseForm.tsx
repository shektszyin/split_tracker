import React, { useState, useEffect } from 'react';
import { User, CategoryItem } from '../types';
import { Check, X, ChevronDown } from 'lucide-react';

interface ExpenseFormProps {
  // FIXED: Changed paidBy to paid_by to match your database
  onSubmit: (data: { name: string; amount: number; category: string; paid_by: string }) => void;
  onCancel: () => void;
  categories: CategoryItem[];
  getCategoryColor: (name: string) => string;
  userNames: string[];
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, onCancel, categories, getCategoryColor, userNames }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>('');
  const [paidBy, setPaidBy] = useState<string>(userNames[0]);

  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0].name);
    }
  }, [categories, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !category) return;

    // FIXED: Now correctly sends 'paid_by' to match the interface above
    onSubmit({
      name,
      amount: parseFloat(amount),
      category,
      paid_by: paidBy, 
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">New Expense</h2>
        <button onClick={onCancel} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
        <div className="relative">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Amount</label>
            <div className="flex items-center">
                <span className="text-3xl font-bold text-zinc-500 mr-2">$</span>
                <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-transparent border-none p-0 text-5xl font-bold text-white placeholder-zinc-700 focus:ring-0"
                    autoFocus
                    required
                />
            </div>
        </div>

        <div>
             <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Description</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What is this for?"
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-4 text-lg text-white placeholder-zinc-600 focus:ring-0"
              required
            />
        </div>

        <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Category</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                     <div 
                        className="w-3 h-3 rounded-full ring-2 ring-zinc-900" 
                        style={{ backgroundColor: getCategoryColor(category) }} 
                    />
                </div>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl pl-12 pr-12 py-4 text-lg text-white appearance-none focus:ring-0"
                >
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.name} className="bg-zinc-900 text-white">
                            {cat.name}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                    <ChevronDown className="w-5 h-5 text-zinc-500" />
                </div>
            </div>
        </div>

        <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Paid By</label>
            <div className="grid grid-cols-2 gap-4">
                {userNames.map((user) => (
                    <button
                        key={user}
                        type="button"
                        onClick={() => setPaidBy(user)}
                        className={`py-4 rounded-2xl font-medium transition-all ${
                            paidBy === user
                            ? 'bg-zinc-800 text-white ring-1 ring-white/10'
                            : 'bg-zinc-900/50 text-zinc-500 hover:bg-zinc-900'
                        }`}
                    >
                        {user}
                    </button>
                ))}
            </div>
        </div>

        <div className="mt-auto pt-4">
            <button
                type="submit"
                className="w-full bg-white text-black font-bold text-lg py-5 rounded-[24px] hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 active:scale-95 duration-200"
            >
                <Check className="w-6 h-6" />
                Save Transaction
            </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;