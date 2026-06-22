import { apiClient } from '@/api/client';
import type { GenericResponse, UtenteLoginResponse } from '@/api/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  nome: string;
  cognome: string;
  telefono?: string;
}

export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post<GenericResponse<UtenteLoginResponse>>(
    '/api/app/auth/login',
    payload
  );
  return data.data;
}

export async function register(payload: RegisterPayload) {
  const { data } = await apiClient.post<GenericResponse<UtenteLoginResponse>>(
    '/api/app/auth/register',
    payload
  );
  return data.data;
}
