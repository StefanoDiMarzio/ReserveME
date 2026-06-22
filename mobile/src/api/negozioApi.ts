import { apiClient } from '@/api/client';
import type { GenericResponse, NegozioPubblico, PageResponse, TipoNegozio } from '@/api/types';

export interface CercaNegoziParams {
  testo?: string;
  tipo?: TipoNegozio;
  lat?: number;
  lng?: number;
  page?: number;
  size?: number;
}

export async function cercaNegozi(params: CercaNegoziParams) {
  const { data } = await apiClient.get<GenericResponse<PageResponse<NegozioPubblico>>>(
    '/api/public/negozi/cerca',
    { params }
  );
  return data.data;
}

export async function getNegozioDettaglio(id: number) {
  const { data } = await apiClient.get<GenericResponse<NegozioPubblico>>(`/api/public/negozi/${id}`);
  return data.data;
}
