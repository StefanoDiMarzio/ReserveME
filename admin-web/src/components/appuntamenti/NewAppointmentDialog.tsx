import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { creaAppuntamento } from "@/lib/api/appuntamenti"
import { getClientiPaginati } from "@/lib/api/clienti"
import { getServiziTutti } from "@/lib/api/servizi"
import { extractErrorMessage } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function NewAppointmentDialog({
  open,
  onOpenChange,
  defaultDate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultDate: string
}) {
  const queryClient = useQueryClient()

  const [clienteId, setClienteId] = useState<string>("")
  const [servizioId, setServizioId] = useState<string>("")
  const [dataOra, setDataOra] = useState(`${defaultDate}T09:00`)
  const [note, setNote] = useState("")
  const [error, setError] = useState<string | null>(null)

  const { data: clienti } = useQuery({
    queryKey: ["clienti", "tutti-per-select"],
    queryFn: () => getClientiPaginati(0, 200),
    enabled: open,
  })

  const { data: servizi } = useQuery({
    queryKey: ["servizi", "tutti"],
    queryFn: getServiziTutti,
    enabled: open,
  })

  const mutation = useMutation({
    mutationFn: creaAppuntamento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appuntamenti"] })
      onOpenChange(false)
      resetForm()
    },
    onError: (err) => setError(extractErrorMessage(err, "Non è stato possibile creare l'appuntamento.")),
  })

  function resetForm() {
    setClienteId("")
    setServizioId("")
    setNote("")
    setError(null)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!clienteId || !servizioId) {
      setError("Seleziona cliente e servizio.")
      return
    }
    mutation.mutate({
      clienteId: Number(clienteId),
      servizioId: Number(servizioId),
      dataOraInizio: `${dataOra}:00`,
      note: note.trim() || undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuovo appuntamento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label>Cliente</Label>
            <Select value={clienteId} onValueChange={(v) => setClienteId(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleziona cliente" />
              </SelectTrigger>
              <SelectContent>
                {clienti?.content.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.nome} {c.cognome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label>Servizio</Label>
            <Select value={servizioId} onValueChange={(v) => setServizioId(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleziona servizio" />
              </SelectTrigger>
              <SelectContent>
                {servizi?.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.nomeTrattamento} — €{s.costo.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="dataOra">Data e ora</Label>
            <input
              id="dataOra"
              type="datetime-local"
              value={dataOra}
              onChange={(e) => setDataOra(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="note">Note (opzionale)</Label>
            <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creazione..." : "Crea appuntamento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
