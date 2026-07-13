import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  getMe: () => api.get('/auth/me'),
  upgrade: () => api.post('/auth/upgrade'),
  githubLogin: () => {
    window.location.href = '/api/auth/github';
  },
};

export const reposAPI = {
  sync: () => api.get('/repos/sync'),
  getAll: () => api.get('/repos'),
  getOne: (id) => api.get(`/repos/${id}`),
  analyze: (id) => api.get(`/repos/${id}/analyze`),
};

export const aiAPI = {
  generateReadme: (repoId) => api.post('/ai/generate-readme', { repoId }),
  generateDescription: (repoId) => api.post('/ai/generate-description', { repoId }),
  generatePortfolio: () => api.post('/ai/generate-portfolio'),
  summarizePR: (data) => api.post('/ai/summarize-pr', data),
  explainBug: (data) => api.post('/ai/explain-bug', data),
  getGenerations: () => api.get('/ai/generations'),
};

export default api;
