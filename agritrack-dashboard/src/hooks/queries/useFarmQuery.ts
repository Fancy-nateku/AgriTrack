import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

interface Farm {
  id: string;
  owner_id: string;
  name: string;
  location: string;
  size_acres: number;
  created_at: string;
}

/**
 * React Query hook to get or create the user's default farm
 * Includes automatic caching and background refetching
 */
export const useDefaultFarmQuery = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['farm', user?.id],
    queryFn: async () => {
      if (!user) {
        return null;
      }

      // Check if user has any farms
      const { data: farms, error: fetchError } = await supabase
        .from('farms')
        .select('*')
        .eq('owner_id', user.id)
        .limit(1);

      if (fetchError) throw fetchError;

      if (farms && farms.length > 0) {
        return farms[0];
      }

      // Create a default farm
      const { data: newFarm, error: createError } = await supabase
        .from('farms')
        .insert({
          owner_id: user.id,
          name: 'My Farm',
          location: '',
          size_acres: 0,
        })
        .select('*')
        .single();

      if (createError) {
        // Handle duplicate key error
        if (createError.code === '23505' || createError.message.includes('duplicate')) {
          const { data: existingFarms } = await supabase
            .from('farms')
            .select('*')
            .eq('owner_id', user.id)
            .limit(1);
          
          if (existingFarms && existingFarms.length > 0) {
            return existingFarms[0];
          }
        }
        throw createError;
      }

      return newFarm;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 2,
  });
};

/**
 * Hook to update farm details
 */
export const useUpdateFarm = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updates: Partial<Farm>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('farms')
        .update(updates)
        .eq('owner_id', user.id)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Update the cache with the new data
      queryClient.setQueryData(['farm', user?.id], data);
    },
  });
};
