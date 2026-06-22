import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

import * as authApi from "@/lib/api/auth"
import { clearToken, getToken, saveToken, setUnauthorizedHandler } from "@/lib/api/client"

interface AdminUser {
  nome: string
  cognome: string
  email: string
  codiceUnivoco: string
  negozioId: number
  nomeNegozio: string
}

interface AuthContextValue {
  isLoading: boolean
  isAuthenticated: boolean
  user: AdminUser | null
  login: (codiceUnivoco: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const USER_KEY = "reserveme_admin_user"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<AdminUser | null>(null)

  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null))

    const token = getToken()
    const storedUser = localStorage.getItem(USER_KEY)
    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      isAuthenticated: !!user,
      user,
      login: async (codiceUnivoco, password) => {
        const res = await authApi.login({ codiceUnivoco, password })
        saveToken(res.token)
        const adminUser: AdminUser = {
          nome: res.nome,
          cognome: res.cognome,
          email: res.email,
          codiceUnivoco: res.codiceUnivoco,
          negozioId: res.negozioId,
          nomeNegozio: res.nomeNegozio,
        }
        localStorage.setItem(USER_KEY, JSON.stringify(adminUser))
        setUser(adminUser)
      },
      logout: () => {
        clearToken()
        localStorage.removeItem(USER_KEY)
        setUser(null)
      },
    }),
    [isLoading, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth deve essere usato dentro AuthProvider")
  return ctx
}
