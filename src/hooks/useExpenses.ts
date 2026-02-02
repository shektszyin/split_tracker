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
      }, () => fetchExpenses())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [householdId, fetchExpenses]);

  const updateExpense = useCallback(async (id: string, updatedData: any) => {
    const { error: err } = await supabase
      .from('expenses')
      .update({
        name: updatedData.name,
        amount: Number(updatedData.amount),
        category: updatedData.category,
        paid_by: updatedData.paid_by,
        created_at: updatedData.created_at,
        month: new Date(updatedData.created_at).toISOString().slice(0, 7)
      })
      .eq('id', id);

    if (err) {
      console.error("Update Error:", err.message);
    } else {
      fetchExpenses(); 
    }
  }, [fetchExpenses]);

  const addExpense = useCallback(async (data: any) => {
    const { error: err } = await supabase.from('expenses').insert([{
      ...data,
      household_id: householdId,
      month: new Date(data.created_at || Date.now()).toISOString().slice(0, 7)
    }]);
    if (err) console.error("Add Error:", err.message);
  }, [householdId]);

  const deleteExpense = useCallback(async (id: string | number) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    await supabase.from('expenses').delete().eq('id', id);
  }, []);

  // FIXED: Summary now filters for the current month to "reset" the dashboard
  const summary = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentMonthExpenses = expenses.filter(e => e.month === currentMonth);

    if (currentMonthExpenses.length === 0) {
      return { total: 0, totalA: 0, totalB: 0, settlement: { debtor: 'Shek', creditor: 'Yoyo', amount: 0 } };
    }

    const total = currentMonthExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const totalA = currentMonthExpenses.filter(e => e.paid_by === 'Shek').reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const totalB = currentMonthExpenses.filter(e => e.paid_by === 'Yoyo').reduce((sum, e) => sum + Number(e.amount || 0), 0);
    
    return {
      total, totalA, totalB,
      settlement: {
        debtor: totalA < totalB ? 'Shek' : 'Yoyo',
        creditor: totalA < totalB ? 'Yoyo' : 'Shek',
        amount: Math.abs(totalA - totalB) / 2,
      },
    };
  }, [expenses]);

  return { expenses, isLoading, error, addExpense, deleteExpense, updateExpense, summary };
};