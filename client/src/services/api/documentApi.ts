import apiClient from './client';

export const documentApi = {
  publicUpload: async (formData: FormData) => {
    const { data } = await apiClient.post('/public/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  upload: async (formData: FormData) => {
    const { data } = await apiClient.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },
};
