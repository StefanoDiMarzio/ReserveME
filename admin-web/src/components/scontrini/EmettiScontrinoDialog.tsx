import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Plus, Trash2 } from "lucide-react"

import { emettiScontrino, type VoceScontrinoPayload } from "@/lib/api/scontrini"
import { extractErrorMessage } from "@/lib/api/client"
import { getClientiPaginati } from "@/lib/api/clienti"
import { getServiziTutti } from "@/lib/api/servizi"
import { getProdottiPaginati } from "@/lib/api/prodotti"
import type { MetodoPagamento, TipoDocumento } from "@/lib/api/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

interface VoceForm {
  tipo: "servizio" | "prodotto"
  itemId: string
  descrizione: string
  quantita: string
  prezzoUnitario: string
}

function nuovaVoceVuota(): VoceForm {
  return { tipo: "servizio", itemId: "", descrizione: "", quantita: "1", prezzoUnitario: "" }
}

export function EmettiScontrinoDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const queryClient = useQueryClient()

  const [clienteId, setClienteId] = useState<string>("")
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>("SCONTRINO")
  const [metodoPagamento, setMetodoPagamento] = useState<MetodoPagamento>("CONTANTI")
  const [importoContanti, setImportoContanti] = useState("0")
  const [importoPos, setImportoPos] = useState("0")
  const [voci, setVoci] = useState<VoceForm[]>([nuovaVoceVuota()])
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
  const { data: prodottiPagina } = useQuery({
    queryKey: ["prodotti", "tutti-per-select"],
    queryFn: () => getProdottiPaginati(0, 200),
    enabled: open,
  })
  const prodotti = prodottiPagina?.content ?? []

  useEffect(() => {
    if (open) {
      setClienteId("")
      setTipoDocumento("SCONTRINO")
      setMetodoPagamento("CONTANTI")
      setImportoContanti("0")
      setImportoPos("0")
      setVoci([nuovaVoceVuota()])
      setError(null)
    }
  }, [open])

  const totale = voci.reduce((sum, v) => sum + (Number(v.quantita) || 0) * (Number(v.prezzoUnitario) || 0), 0)

  const mutation = useMutation({
    mutationFn: emettiScontrino,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scontrini"] })
      onOpenChange(false)
    },
    onError: (err) => setError(extractErrorMessage(err, "Non è stato possibile emettere il documento.")),
  })

  function updateVoce(index: number, patch: Partial<VoceForm>) {
    setVoci((prev) => prev.map((v, i) => (i === index ? { ...v, ...patch } : v)))
  }

  function handleSelectItem(index: number, tipo: "servizio" | "prodotto", itemId: string) {
    if (tipo === "servizio") {
      const s = servizi?.find((x) => String(x.id) === itemId)
      updateVoce(index, { tipo, itemId, descrizione: s?.nomeTrattamento ?? "", prezzoUnitario: s ? String(s.costo) : "" })
    } else {
      const p = prodotti.find((x) => String(x.id) === itemId)
      updateVoce(index, { tipo, itemId, descrizione: p?.nome ?? "", prezzoUnitario: p ? String(p.prezzoVendita) : "" })
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const vociPayload: VoceScontrinoPayload[] = voci.map((v) => ({
      servizioId: v.tipo === "servizio" && v.itemId ? Number(v.itemId) : undefined,
      prodottoId: v.tipo === "prodotto" && v.itemId ? Number(v.itemId) : undefined,
      descrizione: v.descrizione,
      quantita: Number(v.quantita) || 1,
      prezzoUnitario: Number(v.prezzoUnitario) || 0,
    }))

    mutation.mutate({
      clienteId: clienteId ? Number(clienteId) : undefined,
      metodoPagamento,
      tipoDocumento,
      importoContanti: metodoPagamento === "MISTO" ? Number(importoContanti) : undefined,
      importoPos: metodoPagamento === "MISTO" ? Number(importoPos) : undefined,
      voci: vociPayload,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Emetti documento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid max-h-[70vh] gap-4 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Tipo documento</Label>
              <Select value={tipoDocumento} onValueChange={(v) => setTipoDocumento(v as TipoDocumento)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCONTRINO">Scontrino</SelectItem>
                  <SelectItem value="FATTURA">Fattura</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Cliente (opzionale)</Label>
              <Select value={clienteId} onValueChange={(v) => setClienteId(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Nessun cliente" />
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
          </div>

          <div className="grid gap-1.5">
            <Label>Metodo di pagamento</Label>
            <Select value={metodoPagamento} onValueChange={(v) => setMetodoPagamento(v as MetodoPagamento)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONTANTI">Contanti</SelectItem>
                <SelectItem value="POS">POS</SelectItem>
                <SelectItem value="MISTO">Misto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {metodoPagamento === "MISTO" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label>Importo contanti</Label>
                <Input type="number" step="0.01" value={importoContanti} onChange={(e) => setImportoContanti(e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label>Importo POS</Label>
                <Input type="number" step="0.01" value={importoPos} onChange={(e) => setImportoPos(e.target.value)} />
              </div>
            </div>
          )}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label>Voci</Label>
              <Button type="button" size="sm" variant="outline" onClick={() => setVoci((v) => [...v, nuovaVoceVuota()])}>
                <Plus className="h-3.5 w-3.5" />
                Aggiungi voce
              </Button>
            </div>

            <div className="grid gap-3">
              {voci.map((voce, i) => (
                <div key={i} className="grid grid-cols-12 items-end gap-2 rounded-md border border-border p-2">
                  <div className="col-span-3">
                    <Select
                      value={voce.tipo}
                      onValueChange={(v) => updateVoce(i, { tipo: v as "servizio" | "prodotto", itemId: "", descrizione: "", prezzoUnitario: "" })}
                    >
                      <SelectTrigger className="w-full" size="sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="servizio">Servizio</SelectItem>
                        <SelectItem value="prodotto">Prodotto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-4">
                    <Select value={voce.itemId} onValueChange={(v) => handleSelectItem(i, voce.tipo, v ?? "")}>
                      <SelectTrigger className="w-full" size="sm">
                        <SelectValue placeholder="Seleziona" />
                      </SelectTrigger>
                      <SelectContent>
                        {(voce.tipo === "servizio" ? servizi ?? [] : prodotti).map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {"nomeTrattamento" in item ? item.nomeTrattamento : item.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="1"
                      placeholder="Qtà"
                      value={voce.quantita}
                      onChange={(e) => updateVoce(i, { quantita: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Prezzo"
                      value={voce.prezzoUnitario}
                      onChange={(e) => updateVoce(i, { prezzoUnitario: e.target.value })}
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      disabled={voci.length === 1}
                      onClick={() => setVoci((v) => v.filter((_, idx) => idx !== i))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-end text-sm font-semibold">Totale: €{totale.toFixed(2)}</div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Emissione..." : "Emetti documento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
