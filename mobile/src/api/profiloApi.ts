import { apiClient } from '@/api/client';
import type { GenericResponse, Profilo } from '@/api/types';

export async function getProfilo() {
  const { data } = await apiClient.get<GenericResponse<Profilo>>('/api/app/profilo');
  return data.data;
}

export interface AggiornaProfiloPayload {
  nome: string;
  cognome: string;
  telefono?: string;
}

export async function aggiornaProfilo(payload: AggiornaProfiloPayload) {
  const { data } = await apiClient.put<GenericResponse<Profilo>>('/api/app/profilo', payload);
  return data.data;
}

export interface CambioPasswordPayload {
  vecchiaPassword: string;
  nuovaPassword: string;
}

export async function cambiaPassword(payload: CambioPasswordPayload) {
  await apiClient.put('/api/app/profilo/password', payload);
}
