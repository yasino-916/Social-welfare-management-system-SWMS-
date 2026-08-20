import apiClient from './client';

export const reportApi = {
  getDashboard: async () => {
    const { data } = await apiClient.get('/reports/dashboard');
    return data.data;
  },

  getPersonsByAgeRange: async (params?: Record<string, unknown>) => {
    const { data } = await apiClient.get('/reports/persons/age-range', { params });
    return data.data as { range: string; count: number }[];
  },

  getHouseholds: async (params?: Record<string, unknown>) => {
    const { data } = await apiClient.get('/reports/households', { params });
    return data.data;
  },

  getApplicationsByStatus: async (params?: Record<string, unknown>) => {
    const { data } = await apiClient.get('/reports/applications/status', { params });
    return data.data;
  },

  getComplaintStats: async (params?: Record<string, unknown>) => {
    const { data } = await apiClient.get('/reports/complaints', { params });
    return data.data;
  },

  exportReport: async (type: string, params?: Record<string, unknown>) => {
    const response = await apiClient.get(`/reports/export/${type}`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};
