import apiClient from './client';

export const searchApi = {
  search: async (params: Record<string, unknown>) => {
    const { data } = await apiClient.get('/search', { params });
    return data.data as Record<string, unknown>[];
  },
};
