import axios from "axios"

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080"

const TOKEN_KEY = "reserveme_admin_token"

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

let onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler
}

apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken()
      onUnauthorized?.()
    }
    return Promise.reject(error)
  }
)

export function extractErrorMessage(error: unknown, fallback = "Si è verificato un errore. Riprova.") {
  const anyErr = error as { response?: { data?: { message?: string } } }
  return anyErr?.response?.data?.message ?? fallback
}
