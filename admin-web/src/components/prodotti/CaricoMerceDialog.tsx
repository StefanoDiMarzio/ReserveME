import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { caricoProdotto } from "@/lib/api/prodotti"
import type { Prodotto } from "@/lib/api/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function CaricoMerceDialog({
  open,
  onOpenChange,
  prodotto,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  prodotto: Prodotto | null
}) {
  const queryClient = useQueryClient()
  const [quantita, setQuantita] = useState("1")

  const mutation = useMutation({
    mutationFn: () => caricoProdotto(prodotto!.id, Number(quantita)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prodotti"] })
      onOpenChange(false)
      setQuantita("1")
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Carico merce — {prodotto?.nome}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-1.5">
          <Label htmlFor="caricoQuantita">Quantità da aggiungere</Label>
          <Input
            id="caricoQuantita"
            type="number"
            min="1"
            value={quantita}
            onChange={(e) => setQuantita(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Scorta attuale: {prodotto?.quantita} → nuova scorta: {(prodotto?.quantita ?? 0) + Number(quantita || 0)}
          </p>
        </div>

        <DialogFooter>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? "Aggiornamento..." : "Conferma carico"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
