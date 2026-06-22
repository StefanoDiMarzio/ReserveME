import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Check, Clock, Plus, User, X } from "lucide-react"
import { toast } from "sonner"

import {
  cambiaStatoAppuntamento,
  eliminaAppuntamento,
  getAppuntamentiPerPeriodo,
} from "@/lib/api/appuntamenti"
import type { Appuntamento, StatoAppuntamento } from "@/lib/api/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { NewAppointmentDialog } from "@/components/appuntamenti/NewAppointmentDialog"

const STATO_INFO: Record<StatoAppuntamento, { label: string; variant: "secondary" | "default" | "destructive" | "outline" }> = {
  IN_ATTESA: { label: "In attesa", variant: "secondary" },
  CONFERMATO: { label: "Confermato", variant: "default" },
  COMPLETATO: { label: "Completato", variant: "outline" },
  ANNULLATO: { label: "Annullato", variant: "destructive" },
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function CalendarioPage() {
  const queryClient = useQueryClient()
  const [selectedDate, setSelectedDate] = useState(todayIso())
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data: appuntamenti, isLoading } = useQuery({
    queryKey: ["appuntamenti", selectedDate],
    queryFn: () => getAppuntamentiPerPeriodo(`${selectedDate}T00:00:00`, `${selectedDate}T23:59:59`),
  })

  const sorted = useMemo(
    () => [...(appuntamenti ?? [])].sort((a, b) => a.dataOraInizio.localeCompare(b.dataOraInizio)),
    [appuntamenti]
  )

  const statoMutation = useMutation({
    mutationFn: ({ id, stato }: { id: number; stato: StatoAppuntamento }) =>
      cambiaStatoAppuntamento(id, stato),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appuntamenti"] })
      toast.success("Stato appuntamento aggiornato")
    },
    onError: () => toast.error("Non è stato possibile aggiornare lo stato"),
  })

  const eliminaMutation = useMutation({
    mutationFn: eliminaAppuntamento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appuntamenti"] })
      toast.success("Appuntamento annullato")
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Calendario</h1>
          <p className="mt-1 text-muted-foreground">Gestisci gli appuntamenti del tuo negozio</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuovo appuntamento
        </Button>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none"
        />
        <Button variant="outline" size="sm" onClick={() => setSelectedDate(todayIso())}>
          Oggi
        </Button>
      </div>

      <div className="mt-6 grid gap-3">
        {isLoading ? (
          [0, 1, 2].map((i) => <Skeleton key={i} className="h-24 w-full" />)
        ) : sorted.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            Nessun appuntamento per questa data.
          </Card>
        ) : (
          sorted.map((app) => (
            <AppointmentRow
              key={app.id}
              appuntamento={app}
              onConferma={() => statoMutation.mutate({ id: app.id, stato: "CONFERMATO" })}
              onCompleta={() => statoMutation.mutate({ id: app.id, stato: "COMPLETATO" })}
              onAnnulla={() => eliminaMutation.mutate(app.id)}
            />
          ))
        )}
      </div>

      <NewAppointmentDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultDate={selectedDate} />
    </div>
  )
}

function AppointmentRow({
  appuntamento,
  onConferma,
  onCompleta,
  onAnnulla,
}: {
  appuntamento: Appuntamento
  onConferma: () => void
  onCompleta: () => void
  onAnnulla: () => void
}) {
  const stato = STATO_INFO[appuntamento.stato]
  const inizio = new Date(appuntamento.dataOraInizio)
  const fine = new Date(appuntamento.dataOraFine)

  return (
    <Card className="flex flex-row items-center justify-between gap-4 p-4">
      <div className="flex items-center gap-4">
        <div className="flex w-20 flex-col items-center justify-center rounded-md bg-muted py-2 text-sm font-medium">
          <Clock className="mb-1 h-3.5 w-3.5 text-muted-foreground" />
          {inizio.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
          <span className="text-xs text-muted-foreground">
            {fine.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        <div>
          <p className="font-medium">{appuntamento.servizio.nomeTrattamento}</p>
          <div className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            {appuntamento.cliente.nome} {appuntamento.cliente.cognome}
            {appuntamento.cliente.utente && (
              <Badge variant="outline" className="ml-1 text-[10px]">
                da app
              </Badge>
            )}
          </div>
          {appuntamento.note && (
            <p className="mt-1 text-xs text-muted-foreground">Nota: {appuntamento.note}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">€{appuntamento.servizio.costo.toFixed(2)}</span>
        <Badge variant={stato.variant}>{stato.label}</Badge>

        {appuntamento.stato === "IN_ATTESA" && (
          <Button size="icon" variant="outline" title="Conferma" onClick={onConferma}>
            <Check className="h-4 w-4" />
          </Button>
        )}
        {appuntamento.stato === "CONFERMATO" && (
          <Button size="icon" variant="outline" title="Segna come completato" onClick={onCompleta}>
            <Check className="h-4 w-4" />
          </Button>
        )}
        {appuntamento.stato !== "ANNULLATO" && appuntamento.stato !== "COMPLETATO" && (
          <Button size="icon" variant="outline" title="Annulla" onClick={onAnnulla}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  )
}
