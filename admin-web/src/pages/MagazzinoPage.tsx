import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AlertTriangle, PackagePlus, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { eliminaProdotto, getProdottiPaginati, getProdottiSottoSoglia } from "@/lib/api/prodotti"
import type { Prodotto } from "@/lib/api/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ProdottoFormDialog } from "@/components/prodotti/ProdottoFormDialog"
import { CaricoMerceDialog } from "@/components/prodotti/CaricoMerceDialog"

export function MagazzinoPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Prodotto | null>(null)
  const [caricoTarget, setCaricoTarget] = useState<Prodotto | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const { data: pagina, isLoading } = useQuery({
    queryKey: ["prodotti", "pagina", page],
    queryFn: () => getProdottiPaginati(page, 20),
  })

  const { data: sottoSoglia } = useQuery({
    queryKey: ["prodotti", "sotto-soglia"],
    queryFn: getProdottiSottoSoglia,
  })

  const eliminaMutation = useMutation({
    mutationFn: eliminaProdotto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prodotti"] })
      toast.success("Prodotto eliminato")
      setDeletingId(null)
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Magazzino</h1>
          <p className="mt-1 text-muted-foreground">Gestione scorte e prodotti</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          Nuovo prodotto
        </Button>
      </div>

      {sottoSoglia && sottoSoglia.length > 0 && (
        <div className="mt-6 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          {sottoSoglia.length} prodott{sottoSoglia.length === 1 ? "o" : "i"} sotto la soglia minima di scorta
        </div>
      )}

      <div className="mt-6 rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prodotto</TableHead>
              <TableHead>Quantità</TableHead>
              <TableHead>Prezzo acquisto</TableHead>
              <TableHead>Prezzo vendita</TableHead>
              <TableHead>Ricarico</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [0, 1, 2].map((i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : pagina?.content.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Nessun prodotto in magazzino.
                </TableCell>
              </TableRow>
            ) : (
              pagina?.content.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    {p.nome}
                    {p.quantita <= p.sogliaMinima && (
                      <Badge variant="destructive" className="ml-2">
                        Scorta bassa
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{p.quantita}</TableCell>
                  <TableCell>€{p.prezzoAcquisto.toFixed(2)}</TableCell>
                  <TableCell>€{p.prezzoVendita.toFixed(2)}</TableCell>
                  <TableCell>{p.ricaricoPercentuale != null ? `${p.ricaricoPercentuale.toFixed(1)}%` : "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" title="Carico merce" onClick={() => setCaricoTarget(p)}>
                      <PackagePlus className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      title="Modifica"
                      onClick={() => {
                        setEditing(p)
                        setFormOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" title="Elimina" onClick={() => setDeletingId(p.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

      <ProdottoFormDialog open={formOpen} onOpenChange={setFormOpen} prodotto={editing} />
      <CaricoMerceDialog
        open={caricoTarget !== null}
        onOpenChange={(open) => !open && setCaricoTarget(null)}
        prodotto={caricoTarget}
      />

      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare questo prodotto?</AlertDialogTitle>
            <AlertDialogDescription>L'operazione non è reversibile.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingId && eliminaMutation.mutate(deletingId)}>
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
