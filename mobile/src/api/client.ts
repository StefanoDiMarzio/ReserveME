import axios from 'axios';

import { API_BASE_URL } from '@/constants/config';
import { clearToken, getToken } from '@/auth/tokenStorage';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await clearToken();
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);

export function extractErrorMessage(error: unknown, fallback = 'Si è verificato un errore. Riprova.') {
  const anyErr = error as { response?: { data?: { message?: string } } };
  return anyErr?.response?.data?.message ?? fallback;
}
