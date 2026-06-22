import { apiClient } from "@/lib/api/client"
import type { GenericResponse, PageResponse, Prodotto } from "@/lib/api/types"

export interface ProdottoPayload {
  nome: string
  descrizione?: string
  quantita: number
  prezzoAcquisto: number
  prezzoVendita: number
  sogliaMinima?: number
}

export async function getProdottiPaginati(page: number, size: number) {
  const { data } = await apiClient.get<GenericResponse<PageResponse<Prodotto>>>("/api/prodotti", {
    params: { page, size },
  })
  return data.data
}

export async function getProdottiSottoSoglia() {
  const { data } = await apiClient.get<GenericResponse<Prodotto[]>>("/api/prodotti/sotto-soglia")
  return data.data
}

export async function creaProdotto(payload: ProdottoPayload) {
  const { data } = await apiClient.post<GenericResponse<Prodotto>>("/api/prodotti", payload)
  return data.data
}

export async function aggiornaProdotto(id: number, payload: ProdottoPayload) {
  const { data } = await apiClient.put<GenericResponse<Prodotto>>(`/api/prodotti/${id}`, payload)
  return data.data
}

export async function caricoProdotto(id: number, quantita: number) {
  const { data } = await apiClient.patch<GenericResponse<Prodotto>>(`/api/prodotti/${id}/carico`, null, {
    params: { quantita },
  })
  return data.data
}

export async function eliminaProdotto(id: number) {
  await apiClient.delete(`/api/prodotti/${id}`)
}
