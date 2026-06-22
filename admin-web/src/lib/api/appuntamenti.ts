import { apiClient } from "@/lib/api/client"
import type { Appuntamento, GenericResponse, StatoAppuntamento } from "@/lib/api/types"

export interface AppuntamentoPayload {
  clienteId: number
  servizioId: number
  dataOraInizio: string
  note?: string
}

export async function getAppuntamentiPerPeriodo(start: string, end: string) {
  const { data } = await apiClient.get<GenericResponse<Appuntamento[]>>("/api/appuntamenti", {
    params: { start, end },
  })
  return data.data
}

export async function creaAppuntamento(payload: AppuntamentoPayload) {
  const { data } = await apiClient.post<GenericResponse<Appuntamento>>("/api/appuntamenti", payload)
  return data.data
}

export async function aggiornaAppuntamento(id: number, payload: AppuntamentoPayload) {
  const { data } = await apiClient.put<GenericResponse<Appuntamento>>(`/api/appuntamenti/${id}`, payload)
  return data.data
}

export async function cambiaStatoAppuntamento(id: number, nuovoStato: StatoAppuntamento) {
  const { data } = await apiClient.patch<GenericResponse<Appuntamento>>(
    `/api/appuntamenti/${id}/stato`,
    null,
    { params: { nuovoStato } }
  )
  return data.data
}

export async function eliminaAppuntamento(id: number) {
  await apiClient.delete(`/api/appuntamenti/${id}`)
}
