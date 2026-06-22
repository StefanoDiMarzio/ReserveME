import { useQuery } from "@tanstack/react-query"
import { CalendarCheck, FileText, TrendingUp, Users } from "lucide-react"

import { useAuth } from "@/contexts/AuthContext"
import { getRiepilogo } from "@/lib/api/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function formatEuro(value: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(value)
}

export function DashboardPage() {
  const { user } = useAuth()
  const { data, isLoading } = useQuery({ queryKey: ["dashboard"], queryFn: getRiepilogo })

  return (
    <div>
      <h1 className="text-2xl font-semibold">Ciao, {user?.nome} 👋</h1>
      <p className="mt-1 text-muted-foreground">Ecco il riepilogo di {user?.nomeNegozio}</p>

      {isLoading ? (
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              icon={Users}
              label="Clienti ricevuti"
              value={String(data?.totaleClienti ?? 0)}
              hint={`${data?.clientiUltimoMese ?? 0} nell'ultimo mese`}
            />
            <StatCard
              icon={TrendingUp}
              label="Incassi totali"
              value={formatEuro(data?.incassiTotali ?? 0)}
              hint={`${formatEuro(data?.incassiUltimoMese ?? 0)} nell'ultimo mese`}
            />
            <StatCard
              icon={FileText}
              label="Scontrini emessi"
              value={String(data?.totaleScontrini ?? 0)}
            />
            <StatCard
              icon={CalendarCheck}
              label="Fatture emesse"
              value={String(data?.totaleFatture ?? 0)}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <StatCard
              icon={Users}
              label="Clienti ultima settimana"
              value={String(data?.clientiUltimaSettimana ?? 0)}
            />
            <StatCard
              icon={Users}
              label="Clienti ultimo anno"
              value={String(data?.clientiUltimoAnno ?? 0)}
            />
            <StatCard
              icon={TrendingUp}
              label="Incassi ultima settimana"
              value={formatEuro(data?.incassiUltimaSettimana ?? 0)}
            />
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Users
  label: string
  value: string
  hint?: string
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  )
}
