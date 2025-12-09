import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useDefaultFarm } from './useFarm';
import type { IncomeClient } from '@/types/database';



export const useIncome = () => {
  const [income, setIncome] = useState<IncomeClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { farmId } = useDefaultFarm();

  const fetchIncome = useCallback(async () => {
    if (!farmId) {
      setIncome([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api.income.getAll(farmId);
      setIncome(response.data.income || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch income'));
      console.error('Error fetching income:', err);
    } finally {
      setLoading(false);
    }
  }, [farmId]);

  useEffect(() => {
    fetchIncome();
  }, [fetchIncome]);

  return {
    income,
    loading,
    error,
    refresh: fetchIncome,
  };
};
