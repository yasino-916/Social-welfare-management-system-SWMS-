import apiClient from './client';
import { Application, ApplicationDecision } from '@/types';

export const applicationApi = {
  // Public — no auth required
  publicSubmit: async (payload: Record<string, unknown>) => {
    const { data } = await apiClient.post('/applications/public', payload);
    return data.data as { id: string; reference_number: string };
  },

  checkStatus: async (reference: string, phone?: string) => {
    const { data } = await apiClient.get('/applications/public/status', {
      params: { reference, phone },
    });
    return data.data;
  },

  // Admin
  list: async (params?: Record<string, unknown>) => {
    const { data } = await apiClient.get('/applications', { params });
    return data.data as Application[];
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get(`/applications/${id}`);
    return data.data as Application;
  },

  kebeleDecision: async (
    id: string,
    payload: { decision_type: string; reason?: string }
  ) => {
    const { data } = await apiClient.post(`/applications/${id}/kebele-decision`, payload);
    return data.data;
  },

  submitToWereda: async (applicationIds: string[]) => {
    const { data } = await apiClient.post('/applications/submit-to-wereda', {
      application_ids: applicationIds,
    });
    return data.data;
  },

  batchDecision: async (payload: {
    decision_type: 'ACCEPT_ALL' | 'REJECT_ALL';
    kebele_id: string;
    reason?: string;
  }) => {
    const { data } = await apiClient.post('/applications/batch-decision', payload);
    return data.data;
  },

  weredaDecision: async (
    id: string,
    payload: { decision_type: string; reason?: string }
  ) => {
    const { data } = await apiClient.post(`/applications/${id}/wereda-decision`, payload);
    return data.data;
  },

  getDecisionHistory: async (applicationId: string) => {
    const { data } = await apiClient.get(`/decisions/application/${applicationId}`);
    return data.data as ApplicationDecision[];
  },
};
