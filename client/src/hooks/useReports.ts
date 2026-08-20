import { useQuery } from '@tanstack/react-query';
import { reportApi } from '@/services/api/reportApi';

export function useDashboard() {
  return useQuery({
    queryKey: ['reports', 'dashboard'],
    queryFn: reportApi.getDashboard,
    staleTime: 60_000,
  });
}

export function usePersonsByAgeRange(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['reports', 'age-range', params],
    queryFn: () => reportApi.getPersonsByAgeRange(params),
  });
}

export function useApplicationsByStatus(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['reports', 'app-status', params],
    queryFn: () => reportApi.getApplicationsByStatus(params),
  });
}

export function useComplaintStats(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['reports', 'complaint-stats', params],
    queryFn: () => reportApi.getComplaintStats(params),
  });
}
