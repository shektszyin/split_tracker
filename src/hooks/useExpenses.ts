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

    setExpenses([]);
    if (!USE_BACKEND) {
       localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } else {
      alert("Bulk delete not fully implemented in demo backend API. Refreshing will restore data.");
    }
  }, []);

  const getSummary = useCallback((userNames: string[]): SummaryStats => {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    // We assume userNames[0] is User A (first person) and userNames[1] is User B (second person)
    const userA = userNames[0];
    const userB = userNames[1];

    const totalA = expenses.filter((e) => e.paidBy === userA).reduce((sum, e) => sum + e.amount, 0);
    const totalB = expenses.filter((e) => e.paidBy === userB).reduce((sum, e) => sum + e.amount, 0);

    const diff = totalA - totalB;
    const settlementAmount = Math.abs(diff) / 2;

    let debtor: User = userA;
    let creditor: User = userB;

    if (totalA < totalB) {
      debtor = userA;
      creditor = userB;
    } else {
      debtor = userB;
      creditor = userA;
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
    renameUserInExpenses,
    getSummary,
  };
};