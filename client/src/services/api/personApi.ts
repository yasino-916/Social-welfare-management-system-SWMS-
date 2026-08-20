import apiClient from './client';
import { Person } from '@/types';

export const personApi = {
  checkDuplicate: async (payload: Partial<Person>) => {
    const { data } = await apiClient.post('/persons/check-duplicate', payload);
    return data.data as { possible_duplicates: Person[]; has_duplicates: boolean };
  },

  list: async (params?: Record<string, unknown>) => {
    const { data } = await apiClient.get('/persons', { params });
    return data.data as Person[];
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get(`/persons/${id}`);
    return data.data as Person;
  },

  create: async (payload: Partial<Person>) => {
    const { data } = await apiClient.post('/persons', payload);
    return data.data as Person;
  },

  publicCreate: async (payload: Partial<Person>) => {
    const { data } = await apiClient.post('/public/persons', payload);
    return data.data as Person;
  },

  update: async (id: string, payload: Partial<Person>) => {
    const { data } = await apiClient.put(`/persons/${id}`, payload);
    return data.data as Person;
  },
};
