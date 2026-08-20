import apiClient from './client';
import { SupportProgram, SupportDistribution } from '@/types';

export const supportApi = {
  listPrograms: async () => {
    const { data } = await apiClient.get('/support/programs');
    return data.data as SupportProgram[];
  },

  createProgram: async (payload: Partial<SupportProgram>) => {
    const { data } = await apiClient.post('/support/programs', payload);
    return data.data as SupportProgram;
  },

  listDistributions: async (params?: Record<string, unknown>) => {
    const { data } = await apiClient.get('/support/distributions', { params });
    return data.data as SupportDistribution[];
  },

  recordDistribution: async (payload: Record<string, unknown>) => {
    const { data } = await apiClient.post('/support/distributions', payload);
    return data.data as SupportDistribution;
  },

  getHouseholdHistory: async (householdId: string) => {
    const { data } = await apiClient.get(`/support/distributions/${householdId}/history`);
    return data.data as SupportDistribution[];
  },
};
