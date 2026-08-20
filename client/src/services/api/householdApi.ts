import apiClient from './client';
import { Household, HouseholdMember } from '@/types';

export const householdApi = {
  list: async (params?: Record<string, unknown>) => {
    const { data } = await apiClient.get('/households', { params });
    return data.data as Household[];
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get(`/households/${id}`);
    return data.data as Household;
  },

  create: async (payload: Partial<Household>) => {
    const { data } = await apiClient.post('/households', payload);
    return data.data as Household;
  },

  publicCreate: async (payload: Partial<Household>) => {
    const { data } = await apiClient.post('/public/households', payload);
    return data.data as Household;
  },

  update: async (id: string, payload: Partial<Household>) => {
    const { data } = await apiClient.put(`/households/${id}`, payload);
    return data.data as Household;
  },

  listMembers: async (householdId: string) => {
    const { data } = await apiClient.get(`/households/${householdId}/members`);
    return data.data as HouseholdMember[];
  },

  addMember: async (householdId: string, payload: Partial<HouseholdMember>) => {
    const { data } = await apiClient.post(`/households/${householdId}/members`, payload);
    return data.data as HouseholdMember;
  },

  publicAddMember: async (householdId: string, payload: Partial<HouseholdMember>) => {
    const { data } = await apiClient.post(`/public/households/${householdId}/members`, payload);
    return data.data as HouseholdMember;
  },
};
