import apiClient from './client';
import { Wereda } from '@/types';

export const weredaApi = {
  get: async () => {
    const { data } = await apiClient.get('/wereda');
    return data.data as Wereda;
  },

  update: async (payload: Partial<Wereda>) => {
    const { data } = await apiClient.put('/wereda', payload);
    return data.data as Wereda;
  }
};
