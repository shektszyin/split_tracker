import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../supabaseClient';

export const useExpenses = (householdId: string) => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    const { data, error: err } = await supabase
      .from('expenses')
      .select('*')
      .eq('household_id', householdId)
      .order('created_at', { ascending: false });
    
    if (err) setError(err.message);
    else setExpenses(data || []);
    setIsLoading(false);
  }, [householdId]);

  useEffect(() => {
    fetchExpenses();
    const channel = supabase.channel(`room-${householdId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'expenses', 
        filter: `household_id=eq.${householdId}` 
      }, () => {
        console.log("Change detected in Supabase, refreshing...");
        fetchExpenses();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [householdId, fetchExpenses]);

  const addExpense = useCallback(async (data: any) => {
    const { error: err } = await supabase.from('expenses').insert([{
      name: data.name,
      amount: Number(data.amount),
      category: data.category,
      paid_by: data.paid_by, 
      household_id: householdId,
      month: new Date().toISOString().slice(0, 7)
    }]);
    if (err) console.error("Add Error:", err.message);
  }, [householdId]);

  const deleteExpense = useCallback(async (id: string | number) => {
    // 1. Log the ID to the console for debugging
    console.log("Attempting to delete ID:", id);

    // 2. Optimistic Update: Hide it instantly
    setExpenses(prev => prev.filter(e => e.id !== id));

    // 3. Delete from Supabase
    const { error: err } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (err) {
      console.error("Supabase Delete Error:", err.message);
      fetchExpenses(); // Re-sync if it failed
    }
  }, [fetchExpenses]);

  const summary = useMemo(() => {
    // Safety check to prevent black screen if expenses is not an array
    if (!Array.isArray(expenses) || expenses.length === 0) {
      return { total: 0, totalA: 0, totalB: 0, settlement: { debtor: 'Shek', creditor: 'Yoyo', amount: 0 } };
    }
    const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const totalA = expenses.filter(e => e.paid_by === 'Shek').reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const totalB = expenses.filter(e => e.paid_by === 'Yoyo').reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const diff = totalA - totalB;
    return {
      total, totalA, totalB,
      settlement: {
        debtor: totalA < totalB ? 'Shek' : 'Yoyo',
        creditor: totalA < totalB ? 'Yoyo' : 'Shek',
        amount: Math.abs(diff) / 2,
      },
    };
  }, [expenses]);

  return { expenses, isLoading, error, addExpense, deleteExpense, summary };
};