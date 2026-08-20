import apiClient from './client';
import { Feedback } from '@/types';

export const feedbackApi = {
  publicSubmit: async (payload: Record<string, unknown>) => {
    const { data } = await apiClient.post('/public/feedback/public', payload);
    return data.data;
  },

  list: async (params?: Record<string, unknown>) => {
    const { data } = await apiClient.get('/feedback', { params });
    return data.data as Feedback[];
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get(`/feedback/${id}`);
    return data.data as Feedback;
  },

  updateStatus: async (id: string, status: string) => {
    const { data } = await apiClient.put(`/feedback/${id}/status`, { status });
    return data.data;
  },
};
