import apiClient from './client';
import { AuditLog } from '@/types';

export const auditApi = {
  list: async (params?: Record<string, unknown>) => {
    const { data } = await apiClient.get('/audit', { params });
    return data.data as AuditLog[];
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get(`/audit/${id}`);
    return data.data as AuditLog;
  },
};
