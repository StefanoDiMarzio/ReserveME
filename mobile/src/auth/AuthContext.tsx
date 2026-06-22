import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import * as authApi from '@/api/authApi';
import { setUnauthorizedHandler } from '@/api/client';
import { clearToken, getToken, saveToken } from '@/auth/tokenStorage';

interface AuthUser {
  utenteId: string;
  email: string;
  nome: string;
  cognome: string;
}

interface AuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: authApi.RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));

    (async () => {
      const token = await getToken();
      // Il token esiste ma non abbiamo più i dati utente in memoria dopo un riavvio:
      // li richiediamo di nuovo solo se serve, qui ci basta sapere che la sessione è valida.
      if (token) {
        setUser((prev) => prev ?? { utenteId: '', email: '', nome: '', cognome: '' });
      }
      setIsLoading(false);
    })();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      isAuthenticated: !!user,
      user,
      login: async (email, password) => {
        const res = await authApi.login({ email, password });
        await saveToken(res.token);
        setUser({ utenteId: res.utenteId, email: res.email, nome: res.nome, cognome: res.cognome });
      },
      register: async (payload) => {
        const res = await authApi.register(payload);
        await saveToken(res.token);
        setUser({ utenteId: res.utenteId, email: res.email, nome: res.nome, cognome: res.cognome });
      },
      logout: async () => {
        await clearToken();
        setUser(null);
      },
    }),
    [isLoading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve essere usato dentro AuthProvider');
  return ctx;
}
