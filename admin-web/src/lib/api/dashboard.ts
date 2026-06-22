import { apiClient } from "@/lib/api/client"
import type { DashboardResponse, GenericResponse } from "@/lib/api/types"

export async function getRiepilogo() {
  const { data } = await apiClient.get<GenericResponse<DashboardResponse>>("/api/dashboard/riepilogo")
  return data.data
}
