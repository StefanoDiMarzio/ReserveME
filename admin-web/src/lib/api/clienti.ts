import { apiClient } from "@/lib/api/client"
import type { Cliente, GenericResponse, PageResponse } from "@/lib/api/types"

export interface ClientePayload {
  nome: string
  cognome: string
  telefono: string
  email?: string
  note?: string
}

export async function getClientiPaginati(page: number, size: number) {
  const { data } = await apiClient.get<GenericResponse<PageResponse<Cliente>>>("/api/clienti", {
    params: { page, size },
  })
  return data.data
}

export async function cercaClientiPerCognome(cognome: string) {
  const { data } = await apiClient.get<GenericResponse<Cliente[]>>("/api/clienti/cerca", {
    params: { cognome },
  })
  return data.data
}

export async function creaCliente(payload: ClientePayload) {
  const { data } = await apiClient.post<GenericResponse<Cliente>>("/api/clienti", payload)
  return data.data
}

export async function aggiornaCliente(id: number, payload: ClientePayload) {
  const { data } = await apiClient.put<GenericResponse<Cliente>>(`/api/clienti/${id}`, payload)
  return data.data
}

export async function eliminaCliente(id: number) {
  await apiClient.delete(`/api/clienti/${id}`)
}
