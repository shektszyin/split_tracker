import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../supabaseClient';

export const useExpenses = (householdId: string) => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchExpenses = async () => {
    setIsLoading(true);
    // This part communicates with the database on refresh
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('household_id', householdId) 
      .order('created_at', { ascending: false });

    if (!error) setExpenses(data || []); // This updates the screen with saved data
    setIsLoading(false);
  };

  fetchExpenses();
}, [householdId]); // This ensures it runs every time the house ID is detected

  const addExpense = useCallback(async (data: any) => {
    const { error } = await supabase.from('expenses').insert([{
      name: data.name,
      amount: Number(data.amount),
      category: data.category,
      paid_by: data.paidBy, 
      household_id: householdId,
      month: new Date().toISOString().slice(0, 7)
    }]);
    if (error) setError(error.message);
  }, [householdId]);

 const deleteExpense = useCallback(async (id: string) => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id); // Matches the unique ID of the expense

  if (error) {
    console.error("Delete failed:", error.message);
    setError(error.message); // This will show the error on your screen
  }
}, []);

  const summary = useMemo(() => {
    // Default state to prevent crashes on first load
    if (!expenses.length) return {
      total: 0,
      totalA: 0,
      totalB: 0,
      settlement: { debtor: 'Shek', creditor: 'Yoyo', amount: 0 }
    };

    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const totalShek = expenses.filter(e => e.paid_by === 'Shek').reduce((sum, e) => sum + Number(e.amount), 0);
    const totalYoyo = expenses.filter(e => e.paid_by === 'Yoyo').reduce((sum, e) => sum + Number(e.amount), 0);

    const diff = totalShek - totalYoyo;
    const settlementAmount = Math.abs(diff) / 2;

    return {
      total,
      totalA: totalShek, // Mapped for the Dashboard
      totalB: totalYoyo, // Mapped for the Dashboard
      settlement: {
        debtor: totalShek < totalYoyo ? 'Shek' : 'Yoyo',
        creditor: totalShek < totalYoyo ? 'Yoyo' : 'Shek',
        amount: settlementAmount,
      },
    };
  }, [expenses]);

  return { expenses, isLoading, error, addExpense, deleteExpense, summary };
};