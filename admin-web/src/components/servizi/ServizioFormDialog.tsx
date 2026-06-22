import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { aggiornaServizio, creaServizio, type ServizioPayload } from "@/lib/api/servizi"
import { extractErrorMessage } from "@/lib/api/client"
import type { Servizio } from "@/lib/api/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const EMPTY_FORM = {
  nomeTrattamento: "",
  costo: "",
  durataMinuti: "",
  descrizione: "",
  infoAggiuntive: "",
  attivo: true,
}

export function ServizioFormDialog({
  open,
  onOpenChange,
  servizio,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  servizio?: Servizio | null
}) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setForm(
        servizio
          ? {
              nomeTrattamento: servizio.nomeTrattamento,
              costo: String(servizio.costo),
              durataMinuti: servizio.durataMinuti ? String(servizio.durataMinuti) : "",
              descrizione: servizio.descrizione ?? "",
              infoAggiuntive: servizio.infoAggiuntive ?? "",
              attivo: servizio.attivo,
            }
          : EMPTY_FORM
      )
      setError(null)
    }
  }, [open, servizio])

  const mutation = useMutation({
    mutationFn: (payload: ServizioPayload) =>
      servizio ? aggiornaServizio(servizio.id, payload) : creaServizio(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servizi"] })
      onOpenChange(false)
    },
    onError: (err) => setError(extractErrorMessage(err)),
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    mutation.mutate({
      nomeTrattamento: form.nomeTrattamento,
      costo: Number(form.costo),
      durataMinuti: form.durataMinuti ? Number(form.durataMinuti) : undefined,
      descrizione: form.descrizione || undefined,
      infoAggiuntive: form.infoAggiuntive || undefined,
      attivo: form.attivo,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{servizio ? "Modifica servizio" : "Nuovo servizio"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="nomeTrattamento">Nome trattamento</Label>
            <Input
              id="nomeTrattamento"
              value={form.nomeTrattamento}
              onChange={(e) => setForm({ ...form, nomeTrattamento: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="costo">Prezzo (€)</Label>
              <Input
                id="costo"
                type="number"
                step="0.01"
                min="0"
                value={form.costo}
                onChange={(e) => setForm({ ...form, costo: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="durataMinuti">Durata (min)</Label>
              <Input
                id="durataMinuti"
                type="number"
                min="1"
                value={form.durataMinuti}
                onChange={(e) => setForm({ ...form, durataMinuti: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="descrizione">Descrizione</Label>
            <Textarea
              id="descrizione"
              value={form.descrizione}
              onChange={(e) => setForm({ ...form, descrizione: e.target.value })}
            />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <Label htmlFor="attivo">Visibile nel menu</Label>
            <Switch
              id="attivo"
              checked={form.attivo}
              onCheckedChange={(checked) => setForm({ ...form, attivo: checked })}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Salvataggio..." : "Salva"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
