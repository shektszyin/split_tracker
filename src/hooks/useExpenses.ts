import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../supabaseClient';

export const useExpenses = (householdId: string) => {
  const [expenses, setExpenses, fetchExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  fetchExpenses();

  const channel = supabase
    .channel(`room-${householdId}`)
    .on('postgres_changes', 
      { 
        event: '*', // This catches INSERT, UPDATE, and DELETE
        schema: 'public', 
        table: 'expenses', 
        filter: `household_id=eq.${householdId}` 
      }, 
      () => {
        console.log("Change detected! Refreshing data...");
        fetchExpenses(); 
      }
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}, [householdId, fetchExpenses]);

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
  // 1. Optimistic Update: Remove it from the screen immediately
  setExpenses((prev) => prev.filter((expense) => expense.id !== id));

  // 2. Perform the actual delete in the background
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Delete failed:", error.message);
    // 3. Optional: If the database delete fails, refresh to bring the data back
    fetchExpenses();
  }
}, [fetchExpenses]);

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