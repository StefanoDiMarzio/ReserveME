import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { aggiornaCliente, creaCliente, type ClientePayload } from "@/lib/api/clienti"
import { extractErrorMessage } from "@/lib/api/client"
import type { Cliente } from "@/lib/api/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function ClienteFormDialog({
  open,
  onOpenChange,
  cliente,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  cliente?: Cliente | null
}) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<ClientePayload>({ nome: "", cognome: "", telefono: "", email: "", note: "" })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setForm({
        nome: cliente?.nome ?? "",
        cognome: cliente?.cognome ?? "",
        telefono: cliente?.telefono ?? "",
        email: cliente?.email ?? "",
        note: cliente?.note ?? "",
      })
      setError(null)
    }
  }, [open, cliente])

  const mutation = useMutation({
    mutationFn: (payload: ClientePayload) =>
      cliente ? aggiornaCliente(cliente.id, payload) : creaCliente(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clienti"] })
      onOpenChange(false)
    },
    onError: (err) => setError(extractErrorMessage(err)),
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    mutation.mutate(form)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{cliente ? "Modifica cliente" : "Nuovo cliente"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="cognome">Cognome</Label>
              <Input
                id="cognome"
                value={form.cognome}
                onChange={(e) => setForm({ ...form, cognome: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="telefono">Telefono</Label>
            <Input
              id="telefono"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="note">Note</Label>
            <Textarea id="note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
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
