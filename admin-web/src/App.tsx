import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"

import { AuthProvider } from "@/contexts/AuthContext"
import { AppLayout } from "@/components/layout/AppLayout"
import { RequireAuth } from "@/components/layout/RequireAuth"
import { LoginPage } from "@/pages/LoginPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { CalendarioPage } from "@/pages/CalendarioPage"
import { ClientiPage } from "@/pages/ClientiPage"
import { ServiziPage } from "@/pages/ServiziPage"
import { MagazzinoPage } from "@/pages/MagazzinoPage"
import { ScontriniPage } from "@/pages/ScontriniPage"
import { CassaPage } from "@/pages/CassaPage"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 15_000,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <RequireAuth>
                  <AppLayout />
                </RequireAuth>
              }
            >
              <Route path="/" element={<DashboardPage />} />
              <Route path="/calendario" element={<CalendarioPage />} />
              <Route path="/clienti" element={<ClientiPage />} />
              <Route path="/servizi" element={<ServiziPage />} />
              <Route path="/magazzino" element={<MagazzinoPage />} />
              <Route path="/scontrini" element={<ScontriniPage />} />
              <Route path="/cassa" element={<CassaPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
