import { apiClient } from "@/lib/api/client"
import type { Cassa, ChiusuraCassa, GenericResponse, MovimentoCassa } from "@/lib/api/types"

export async function getCassa() {
  const { data } = await apiClient.get<GenericResponse<Cassa>>("/api/cassa")
  return data.data
}

export async function getMovimenti() {
  const { data } = await apiClient.get<GenericResponse<MovimentoCassa[]>>("/api/cassa/movimenti")
  return data.data
}

export async function chiudiCassa(note?: string) {
  const { data } = await apiClient.post<GenericResponse<ChiusuraCassa>>("/api/cassa/chiusura", { note })
  return data.data
}

export async function getChiusure() {
  const { data } = await apiClient.get<GenericResponse<ChiusuraCassa[]>>("/api/cassa/chiusure")
  return data.data
}
