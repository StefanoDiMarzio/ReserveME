import { apiClient } from "@/lib/api/client"
import type { GenericResponse, LoginResponse } from "@/lib/api/types"

export interface LoginPayload {
  codiceUnivoco: string
  password: string
}

export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post<GenericResponse<LoginResponse>>("/api/auth/login", payload)
  return data.data
}
