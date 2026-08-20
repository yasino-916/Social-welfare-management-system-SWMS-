import apiClient from './client';
import { Complaint } from '@/types';

export const complaintApi = {
  // Public
  publicSubmit: async (payload: Record<string, unknown>) => {
    const { data } = await apiClient.post('/public/complaints/public', payload);
    return data.data as { id: string; complaint_reference: string };
  },

  trackByReference: async (reference: string) => {
    const { data } = await apiClient.get(`/public/complaints/public/${reference}/status`);
    return data.data;
  },

  // Admin
  list: async (params?: Record<string, unknown>) => {
    const { data } = await apiClient.get('/complaints', { params });
    return data.data as Complaint[];
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get(`/complaints/${id}`);
    return data.data as Complaint;
  },

  assign: async (id: string, assigned_to: string) => {
    const { data } = await apiClient.post(`/complaints/${id}/assign`, { assigned_to });
    return data.data;
  },

  addAction: async (id: string, action_description: string) => {
    const { data } = await apiClient.post(`/complaints/${id}/action`, { action_description });
    return data.data;
  },

  escalate: async (id: string, reason: string) => {
    const { data } = await apiClient.post(`/complaints/${id}/escalate`, { reason });
    return data.data;
  },

  resolve: async (id: string, resolution: string) => {
    const { data } = await apiClient.post(`/complaints/${id}/resolve`, { resolution });
    return data.data;
  },

  close: async (id: string) => {
    const { data } = await apiClient.post(`/complaints/${id}/close`);
    return data.data;
  },
};
