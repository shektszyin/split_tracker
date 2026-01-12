import { useState, useEffect, useCallback } from 'react';
import { Expense, SummaryStats, User } from '../types';
import { STORAGE_KEY, USE_BACKEND, API_URL } from '../constants';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial Data Load
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Sync with LocalStorage only if backend is disabled
  useEffect(() => {
    if (!USE_BACKEND) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    }
  }, [expenses]);

  const fetchExpenses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (USE_BACKEND) {
        const response = await fetch(`${API_URL}/expenses`);
        if (!response.ok) throw new Error('Failed to fetch from backend');
        const result = await response.json();
        setExpenses(result.data || []);
      } else {
        // Local Storage Logic
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setExpenses(JSON.parse(stored));
        }
      }
    } catch (err: any) {
      console.error('Load error:', err);
      setError(err.message || 'Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  };

  const addExpense = useCallback(async (expenseData: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };

    try {
      if (USE_BACKEND) {
        const response = await fetch(`${API_URL}/expenses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newExpense),
        });
        if (!response.ok) throw new Error('Failed to save to backend');
      }
      
      // Optimistic update or update after success
      setExpenses((prev) => [newExpense, ...prev]);
    } catch (err: any) {
      console.error('Add error:', err);
      setError('Failed to add expense. Check connection.');
    }
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    // Optimistic Update
    const previousExpenses = [...expenses];
    setExpenses((prev) => prev.filter((e) => e.id !== id));

    try {
      if (USE_BACKEND) {
        const response = await fetch(`${API_URL}/expenses/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete from backend');
      }
    } catch (err: any) {
      console.error('Delete error:', err);
      setError('Failed to delete expense. Restoring data.');
      setExpenses(previousExpenses); // Rollback
    }
  }, [expenses]);

<<<<<<< HEAD
  const renameUserInExpenses = useCallback((oldName: string, newName: string) => {
    setExpenses(prev => prev.map(e => {
        if (e.paidBy === oldName) {
            return { ...e, paidBy: newName };
        }
        return e;
    }));
    // Note: If using backend, we would need a batch update API here
  }, []);

  const clearExpenses = useCallback(async () => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return;

=======
  const clearExpenses = useCallback(async () => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return;

    // Note: A real bulk delete API endpoint would be better here, 
    // but for simplicity we'll just clear local state if using backend for now
    // or loop delete if strict consistency needed.
>>>>>>> 01637ea2cbe9071fac0054fa25c7b2a89e505ea1
    setExpenses([]);
    if (!USE_BACKEND) {
       localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } else {
<<<<<<< HEAD
=======
      // In a real app, you'd implement DELETE /api/expenses/all
>>>>>>> 01637ea2cbe9071fac0054fa25c7b2a89e505ea1
      alert("Bulk delete not fully implemented in demo backend API. Refreshing will restore data.");
    }
  }, []);

<<<<<<< HEAD
  const getSummary = useCallback((userNames: string[]): SummaryStats => {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    // We assume userNames[0] is User A (first person) and userNames[1] is User B (second person)
    const userA = userNames[0];
    const userB = userNames[1];

    const totalA = expenses.filter((e) => e.paidBy === userA).reduce((sum, e) => sum + e.amount, 0);
    const totalB = expenses.filter((e) => e.paidBy === userB).reduce((sum, e) => sum + e.amount, 0);
=======
  const getSummary = useCallback((): SummaryStats => {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalA = expenses.filter((e) => e.paidBy === 'User A').reduce((sum, e) => sum + e.amount, 0);
    const totalB = expenses.filter((e) => e.paidBy === 'User B').reduce((sum, e) => sum + e.amount, 0);
>>>>>>> 01637ea2cbe9071fac0054fa25c7b2a89e505ea1

    const diff = totalA - totalB;
    const settlementAmount = Math.abs(diff) / 2;

<<<<<<< HEAD
    let debtor: User = userA;
    let creditor: User = userB;

    if (totalA < totalB) {
      debtor = userA;
      creditor = userB;
    } else {
      debtor = userB;
      creditor = userA;
=======
    let debtor: User = 'User A';
    let creditor: User = 'User B';

    if (totalA < totalB) {
      debtor = 'User A';
      creditor = 'User B';
    } else {
      debtor = 'User B';
      creditor = 'User A';
>>>>>>> 01637ea2cbe9071fac0054fa25c7b2a89e505ea1
    }

    return {
      total,
      totalA,
      totalB,
      settlement: {
        debtor,
        creditor,
        amount: settlementAmount,
      },
    };
  }, [expenses]);

  return {
    expenses,
    isLoading,
    error,
    addExpense,
    deleteExpense,
    clearExpenses,
<<<<<<< HEAD
    renameUserInExpenses,
    getSummary,
=======
    summary: getSummary(),
>>>>>>> 01637ea2cbe9071fac0054fa25c7b2a89e505ea1
  };
};