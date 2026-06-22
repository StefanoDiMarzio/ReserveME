import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { Sparkles } from "lucide-react"

import { useAuth } from "@/contexts/AuthContext"
import { extractErrorMessage } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()

  const [codiceUnivoco, setCodiceUnivoco] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(codiceUnivoco.trim(), password)
      navigate("/")
    } catch (err) {
      setError(extractErrorMessage(err, "Codice univoco o password non corretti."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <CardTitle>ReserveME Admin</CardTitle>
          <CardDescription>Accedi al pannello di gestione del tuo negozio</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="codiceUnivoco">Codice univoco</Label>
              <Input
                id="codiceUnivoco"
                placeholder="es. ADMIN123"
                value={codiceUnivoco}
                onChange={(e) => setCodiceUnivoco(e.target.value)}
                autoFocus
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={loading} className="mt-1">
              {loading ? "Accesso in corso..." : "Accedi"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
