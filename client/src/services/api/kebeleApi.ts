import apiClient from './client';

export interface Kebele {
  id: string;
  name: string;
  code: string;
  created_at?: string;
  updated_at?: string;
}

export const kebeleApi = {
  list: async () => {
    const res = await apiClient.get<{ success: boolean; data: Kebele[] }>('/kebeles');
    return res.data.data;
  },
  
  create: async (data: { name: string; code: string }) => {
    const res = await apiClient.post<{ success: boolean; data: Kebele }>('/kebeles', data);
    return res.data.data;
  },
  
  update: async (id: string, data: Partial<Kebele>) => {
    const res = await apiClient.put<{ success: boolean; data: Kebele }>(`/kebeles/${id}`, data);
    return res.data.data;
  },
  
  delete: async (id: string) => {
    const res = await apiClient.delete<{ success: boolean; message: string }>(`/kebeles/${id}`);
    return res.data;
  }
};
