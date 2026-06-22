import { apiClient } from "@/lib/api/client"
import type { GenericResponse, Negozio } from "@/lib/api/types"

export async function getNegozio() {
  const { data } = await apiClient.get<GenericResponse<Negozio>>("/api/negozio")
  return data.data
}
