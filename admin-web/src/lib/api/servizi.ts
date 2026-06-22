import { apiClient } from "@/lib/api/client"
import type { GenericResponse, Servizio } from "@/lib/api/types"

export interface ServizioPayload {
  nomeTrattamento: string
  costo: number
  durataMinuti?: number
  descrizione?: string
  infoAggiuntive?: string
  attivo: boolean
}

export async function getServiziTutti() {
  const { data } = await apiClient.get<GenericResponse<Servizio[]>>("/api/servizi/tutti")
  return data.data
}

export async function creaServizio(payload: ServizioPayload) {
  const { data } = await apiClient.post<GenericResponse<Servizio>>("/api/servizi", payload)
  return data.data
}

export async function aggiornaServizio(id: number, payload: ServizioPayload) {
  const { data } = await apiClient.put<GenericResponse<Servizio>>(`/api/servizi/${id}`, payload)
  return data.data
}

export async function disattivaServizio(id: number) {
  await apiClient.delete(`/api/servizi/${id}`)
}
