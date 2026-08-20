import apiClient from './client';

export const authApi = {
  login: async (username: string, password: string) => {
    const { data } = await apiClient.post('/auth/login', { username, password });
    return data.data as { token: string; user: Record<string, unknown> };
  },

  logout: () => apiClient.post('/auth/logout'),

  getMe: async () => {
    const { data } = await apiClient.get('/auth/me');
    return data.data;
  },
};
