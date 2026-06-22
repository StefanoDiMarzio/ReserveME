import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { aggiornaProdotto, creaProdotto, type ProdottoPayload } from "@/lib/api/prodotti"
import { extractErrorMessage } from "@/lib/api/client"
import type { Prodotto } from "@/lib/api/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const EMPTY_FORM = {
  nome: "",
  descrizione: "",
  quantita: "0",
  prezzoAcquisto: "",
  prezzoVendita: "",
  sogliaMinima: "0",
}

export function ProdottoFormDialog({
  open,
  onOpenChange,
  prodotto,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  prodotto?: Prodotto | null
}) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setForm(
        prodotto
          ? {
              nome: prodotto.nome,
              descrizione: prodotto.descrizione ?? "",
              quantita: String(prodotto.quantita),
              prezzoAcquisto: String(prodotto.prezzoAcquisto),
              prezzoVendita: String(prodotto.prezzoVendita),
              sogliaMinima: String(prodotto.sogliaMinima),
            }
          : EMPTY_FORM
      )
      setError(null)
    }
  }, [open, prodotto])

  const mutation = useMutation({
    mutationFn: (payload: ProdottoPayload) =>
      prodotto ? aggiornaProdotto(prodotto.id, payload) : creaProdotto(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prodotti"] })
      onOpenChange(false)
    },
    onError: (err) => setError(extractErrorMessage(err)),
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    mutation.mutate({
      nome: form.nome,
      descrizione: form.descrizione || undefined,
      quantita: Number(form.quantita),
      prezzoAcquisto: Number(form.prezzoAcquisto),
      prezzoVendita: Number(form.prezzoVendita),
      sogliaMinima: form.sogliaMinima ? Number(form.sogliaMinima) : undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{prodotto ? "Modifica prodotto" : "Nuovo prodotto"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="nome">Nome prodotto</Label>
            <Input id="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="descrizione">Descrizione</Label>
            <Textarea
              id="descrizione"
              value={form.descrizione}
              onChange={(e) => setForm({ ...form, descrizione: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="quantita">Quantità</Label>
              <Input
                id="quantita"
                type="number"
                min="0"
                value={form.quantita}
                onChange={(e) => setForm({ ...form, quantita: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="prezzoAcquisto">Prezzo acquisto</Label>
              <Input
                id="prezzoAcquisto"
                type="number"
                step="0.01"
                min="0"
                value={form.prezzoAcquisto}
                onChange={(e) => setForm({ ...form, prezzoAcquisto: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="prezzoVendita">Prezzo vendita</Label>
              <Input
                id="prezzoVendita"
                type="number"
                step="0.01"
                min="0"
                value={form.prezzoVendita}
                onChange={(e) => setForm({ ...form, prezzoVendita: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sogliaMinima">Soglia minima scorta</Label>
            <Input
              id="sogliaMinima"
              type="number"
              min="0"
              value={form.sogliaMinima}
              onChange={(e) => setForm({ ...form, sogliaMinima: e.target.value })}
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
