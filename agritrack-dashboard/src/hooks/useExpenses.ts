import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useDefaultFarm } from './useFarm';
import type { ExpenseClient } from '@/types/database';



export const useExpenses = () => {
  const [expenses, setExpenses] = useState<ExpenseClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { farmId } = useDefaultFarm();

  const fetchExpenses = useCallback(async () => {
    if (!farmId) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api.expenses.getAll(farmId);
      setExpenses(response.data.expenses || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch expenses'));
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  }, [farmId]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return {
    expenses,
    loading,
    error,
    refresh: fetchExpenses,
  };
};
