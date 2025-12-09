import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useDefaultFarmQuery } from './useFarmQuery';

export interface Income {
  id: string;
  farm_id: string;
  source: string;
  amount: number;
  date: string;
  created_at: string;
}

/**
 * React Query hook to fetch income with automatic caching
 */
export const useIncomeQuery = () => {
  const { data: farm } = useDefaultFarmQuery();
  const farmId = farm?.id;

  return useQuery({
    queryKey: ['income', farmId],
    queryFn: async () => {
      if (!farmId) {
        return [];
      }

      const { data, error } = await supabase
        .from('income')
        .select('*')
        .eq('farm_id', farmId)
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!farmId,
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};

/**
 * Hook to add a new income entry
 */
export const useAddIncome = () => {
  const queryClient = useQueryClient();
  const { data: farm } = useDefaultFarmQuery();

  return useMutation({
    mutationFn: async (income: Omit<Income, 'id' | 'farm_id' | 'created_at'>) => {
      if (!farm?.id) throw new Error('No farm found');

      const { data, error } = await supabase
        .from('income')
        .insert({
          ...income,
          farm_id: farm.id,
        })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch income
      queryClient.invalidateQueries({ queryKey: ['income', farm?.id] });
    },
  });
};

/**
 * Hook to update an income entry
 */
export const useUpdateIncome = () => {
  const queryClient = useQueryClient();
  const { data: farm } = useDefaultFarmQuery();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Income> & { id: string }) => {
      const { data, error } = await supabase
        .from('income')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income', farm?.id] });
    },
  });
};

/**
 * Hook to delete an income entry
 */
export const useDeleteIncome = () => {
  const queryClient = useQueryClient();
  const { data: farm } = useDefaultFarmQuery();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('income')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income', farm?.id] });
    },
  });
};
