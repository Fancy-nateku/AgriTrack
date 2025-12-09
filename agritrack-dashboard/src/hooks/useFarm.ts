import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { FarmClient } from '@/types/database';

/**
 * Hook to get the user's default farm ID
 * Creates a default farm if none exists via backend API
 */
export const useDefaultFarm = () => {
  const { user } = useAuth();
  const [farmId, setFarmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const getOrCreateDefaultFarm = async () => {
      if (!user) {
        if (isMounted) {
          setFarmId(null);
          setLoading(false);
        }
        return;
      }

      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }

        // Get or create default farm via backend API
        const response = await api.farms.getDefault();
        const farm = response.data.farm;
        
        if (isMounted && farm) {
          setFarmId(farm.id);
        }
      } catch (err) {
        console.error('Error in useDefaultFarm:', err);
        if (isMounted) setError(err as Error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getOrCreateDefaultFarm();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return { farmId, loading, error };
};
