import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://agronix-bk3l.onrender.com/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agronix_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const sensorService = {
  getLatest: () => api.get('/sensors/latest'),
  getHistory: (timeframe) => api.get(`/sensors/history?timeframe=${timeframe}`),
  getAnalytics: (results = 200, language = 'en') => api.get(`/analytics?results=${results}&language=${language}`),
};

export const weatherService = {
  // Now using our proxy to securely fetch full OneCall data
  getFullWeather: (lat, lon) => api.get(`/weather?lat=${lat}&lon=${lon}`),
};

export const aiService = {
  getRecommendations: () => api.get('/ai/recommendations'),
  chat: (message) => api.post('/ai/chat', { message }),
};

export const motorService = {
  getStatus: () => api.get('/motor/status'),
  toggle: (status) => api.post('/motor/toggle', { status }),
  getAnalytics: () => api.get('/motor/analytics'),
};

export const marketService = {
  getDashboard: (crop) => api.get(`/market/dashboard?crop=${crop}`),
  getVendors: (crop) => api.get(`/market/vendors?crop=${crop}`),
  getGlobal: (crop) => api.get(`/market/global?crop=${crop}`),
};

export default api;
