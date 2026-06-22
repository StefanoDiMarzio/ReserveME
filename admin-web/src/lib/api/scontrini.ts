import { apiClient } from "@/lib/api/client"
import type { GenericResponse, MetodoPagamento, PageResponse, Scontrino, TipoDocumento } from "@/lib/api/types"

export interface VoceScontrinoPayload {
  servizioId?: number
  prodottoId?: number
  descrizione: string
  quantita: number
  prezzoUnitario: number
}

export interface ScontrinoPayload {
  clienteId?: number
  appuntamentoId?: number
  metodoPagamento: MetodoPagamento
  tipoDocumento: TipoDocumento
  importoContanti?: number
  importoPos?: number
  voci: VoceScontrinoPayload[]
}

export async function getScontriniPaginati(page: number, size: number) {
  const { data } = await apiClient.get<GenericResponse<PageResponse<Scontrino>>>("/api/scontrini", {
    params: { page, size },
  })
  return data.data
}

export async function getScontrino(id: number) {
  const { data } = await apiClient.get<GenericResponse<Scontrino>>(`/api/scontrini/${id}`)
  return data.data
}

export async function emettiScontrino(payload: ScontrinoPayload) {
  const { data } = await apiClient.post<GenericResponse<Scontrino>>("/api/scontrini", payload)
  return data.data
}

export async function annullaScontrino(id: number) {
  const { data } = await apiClient.patch<GenericResponse<Scontrino>>(`/api/scontrini/${id}/annulla`)
  return data.data
}
