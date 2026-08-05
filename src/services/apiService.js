/**
 * Mental Calculations — API Service
 * Cliente HTTP centralizado com Axios. Injeta JWT automaticamente.
 */
import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ====================================================
// Interceptor de Request → injeta JWT em toda requisição
// ====================================================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mc_jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ====================================================
// Interceptor de Response → trata erros globais
// ====================================================
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido → limpar e redirecionar para login
      localStorage.removeItem('mc_jwt_token');
      localStorage.removeItem('mc_user');
      window.dispatchEvent(new CustomEvent('mc:unauthorized'));
    }
    const message = error.response?.data?.error || error.message || 'Erro de rede.';
    return Promise.reject(new Error(message));
  }
);

// ====================================================
// Funções da API
// ====================================================

// --- Auth ---
export const authApi = {
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// --- Progresso ---
export const progressApi = {
  getProgress: () => api.get('/progress'),

  /** Registra sessão de fase e atualiza progresso no banco */
  startLevel: (levelId) => api.post('/progress/level/start', { levelId }),
  completeLevel: (levelId, correct, total, avgTimeMs, attemptId, useDoubleCredits = false) =>
    api.post('/progress/level', { levelId, correct, total, avgTimeMs, attemptId, useDoubleCredits }),

  /** Atualiza estado global (créditos, vidas, skin equipada) */
};

// --- Loja ---
export const shopApi = {
  listItems: () => api.get('/shop'),
  buyItem: (itemKey) => api.post('/shop/buy', { itemKey }),
  equipSkin: (itemKey) => api.post('/shop/equip', { itemKey }),
  consumePowerUp: (itemKey) => api.post('/shop/consume', { itemKey }),
};

// --- Ranking ---
export const rankingApi = {
  global: () => api.get('/ranking/global'),
  byLevel: (levelId) => api.get(`/ranking/level/${levelId}`),
};

export default api;
