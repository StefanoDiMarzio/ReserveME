import { apiClient } from '@/api/client';
import type { GenericResponse, Prenotazione, SlotDisponibile } from '@/api/types';

export async function getSlotDisponibili(negozioId: number, servizioId: number, data: string) {
  const { data: res } = await apiClient.get<GenericResponse<SlotDisponibile[]>>(
    '/api/app/prenotazioni/slot',
    { params: { negozioId, servizioId, data } }
  );
  return res.data;
}

export interface CreaPrenotazionePayload {
  negozioId: number;
  servizioId: number;
  dataOraInizio: string;
  note?: string;
}

export async function creaPrenotazione(payload: CreaPrenotazionePayload) {
  const { data } = await apiClient.post<GenericResponse<Prenotazione>>('/api/app/prenotazioni', payload);
  return data.data;
}

export async function getMiePrenotazioni() {
  const { data } = await apiClient.get<GenericResponse<Prenotazione[]>>('/api/app/prenotazioni');
  return data.data;
}

export async function cancellaPrenotazione(id: number) {
  await apiClient.delete(`/api/app/prenotazioni/${id}`);
}
