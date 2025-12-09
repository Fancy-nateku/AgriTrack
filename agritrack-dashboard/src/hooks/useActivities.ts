import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useDefaultFarm } from './useFarm';
import type { ActivityClient } from '@/types/database';

export const useActivities = () => {
  const [activities, setActivities] = useState<ActivityClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { farmId } = useDefaultFarm();

  const fetchActivities = useCallback(async () => {
    if (!farmId) {
      setActivities([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api.activities.getAll(farmId);
      setActivities(response.data.activities || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch activities'));
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  }, [farmId]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    loading,
    error,
    refresh: fetchActivities,
  };
};
