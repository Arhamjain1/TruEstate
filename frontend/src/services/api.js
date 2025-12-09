import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

export const getSales = async (params) => {
  const response = await api.get('/sales', { params });
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/sales/stats');
  return response.data;
};

export default api;
