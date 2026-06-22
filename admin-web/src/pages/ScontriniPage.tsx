import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Eye, Plus, X } from "lucide-react"
import { toast } from "sonner"

import { annullaScontrino, getScontriniPaginati } from "@/lib/api/scontrini"
import type { Scontrino } from "@/lib/api/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EmettiScontrinoDialog } from "@/components/scontrini/EmettiScontrinoDialog"
import { ScontrinoDettaglioDialog } from "@/components/scontrini/ScontrinoDettaglioDialog"

export function ScontriniPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [emettiOpen, setEmettiOpen] = useState(false)
  const [dettaglio, setDettaglio] = useState<Scontrino | null>(null)

  const { data: pagina, isLoading } = useQuery({
    queryKey: ["scontrini", page],
    queryFn: () => getScontriniPaginati(page, 20),
  })

  const annullaMutation = useMutation({
    mutationFn: annullaScontrino,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scontrini"] })
      toast.success("Documento annullato")
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Scontrini e fatture</h1>
          <p className="mt-1 text-muted-foreground">Documenti emessi dal negozio</p>
        </div>
        <Button onClick={() => setEmettiOpen(true)}>
          <Plus className="h-4 w-4" />
          Emetti documento
        </Button>
      </div>

      <div className="mt-6 rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N. documento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Totale</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [0, 1, 2].map((i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : pagina?.content.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Nessun documento emesso.
                </TableCell>
              </TableRow>
            ) : (
              pagina?.content.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.numeroDocumento}</TableCell>
                  <TableCell>{s.tipoDocumento === "FATTURA" ? "Fattura" : "Scontrino"}</TableCell>
                  <TableCell>{new Date(s.dataEmissione).toLocaleDateString("it-IT")}</TableCell>
                  <TableCell>{s.cliente ? `${s.cliente.nome} ${s.cliente.cognome}` : "—"}</TableCell>
                  <TableCell>€{s.totale.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={s.stato === "ANNULLATO" ? "destructive" : "default"}>{s.stato}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => setDettaglio(s)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {s.stato !== "ANNULLATO" && (
                      <Button size="icon" variant="ghost" onClick={() => annullaMutation.mutate(s.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagina && pagina.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Precedente
          </Button>
          <span className="text-sm text-muted-foreground">
            Pagina {page + 1} di {pagina.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page + 1 >= pagina.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Successiva
          </Button>
        </div>
      )}

      <EmettiScontrinoDialog open={emettiOpen} onOpenChange={setEmettiOpen} />
      <ScontrinoDettaglioDialog
        open={dettaglio !== null}
        onOpenChange={(open) => !open && setDettaglio(null)}
        scontrino={dettaglio}
      />
    </div>
  )
}
