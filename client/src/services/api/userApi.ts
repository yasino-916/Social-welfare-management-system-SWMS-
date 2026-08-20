import apiClient from './client';
import { User } from '@/types';

export const userApi = {
  list: async (params?: Record<string, unknown>) => {
    const { data } = await apiClient.get('/users', { params });
    return data.data as User[];
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get(`/users/${id}`);
    return data.data as User;
  },

  create: async (payload: Record<string, unknown>) => {
    const { data } = await apiClient.post('/users', payload);
    return data.data as User;
  },

  update: async (id: string, payload: Partial<User>) => {
    const { data } = await apiClient.put(`/users/${id}`, payload);
    return data.data as User;
  },

  suspend: async (id: string) => {
    const { data } = await apiClient.post(`/users/${id}/suspend`);
    return data.data;
  },

  assignKebele: async (id: string, kebele_id: string) => {
    const { data } = await apiClient.post(`/users/${id}/assign-kebele`, { kebele_id });
    return data.data;
  },
};
