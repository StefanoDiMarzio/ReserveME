import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Pencil, Plus, Search, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { cercaClientiPerCognome, eliminaCliente, getClientiPaginati } from "@/lib/api/clienti"
import type { Cliente } from "@/lib/api/types"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { ClienteFormDialog } from "@/components/clienti/ClienteFormDialog"

export function ClientiPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search, 350)
  const [formOpen, setFormOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const isSearching = debouncedSearch.trim().length > 0

  const { data: pagina, isLoading: loadingPagina } = useQuery({
    queryKey: ["clienti", "pagina", page],
    queryFn: () => getClientiPaginati(page, 20),
    enabled: !isSearching,
  })

  const { data: risultatiRicerca, isLoading: loadingRicerca } = useQuery({
    queryKey: ["clienti", "ricerca", debouncedSearch],
    queryFn: () => cercaClientiPerCognome(debouncedSearch.trim()),
    enabled: isSearching,
  })

  const clienti = isSearching ? risultatiRicerca ?? [] : pagina?.content ?? []
  const isLoading = isSearching ? loadingRicerca : loadingPagina

  const eliminaMutation = useMutation({
    mutationFn: eliminaCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clienti"] })
      toast.success("Cliente eliminato")
      setDeletingId(null)
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Clienti</h1>
          <p className="mt-1 text-muted-foreground">Anagrafica clienti del negozio</p>
        </div>
        <Button
          onClick={() => {
            setEditingCliente(null)
            setFormOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          Nuovo cliente
        </Button>
      </div>

      <div className="relative mt-6 max-w-sm">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cerca per cognome..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-6 rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefono</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Origine</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [0, 1, 2].map((i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : clienti.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nessun cliente trovato.
                </TableCell>
              </TableRow>
            ) : (
              clienti.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">
                    {c.nome} {c.cognome}
                  </TableCell>
                  <TableCell>{c.telefono}</TableCell>
                  <TableCell>{c.email ?? "—"}</TableCell>
                  <TableCell>
                    {c.utente ? <Badge variant="outline">App</Badge> : <Badge variant="secondary">Manuale</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingCliente(c)
                        setFormOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setDeletingId(c.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!isSearching && pagina && pagina.totalPages > 1 && (
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

      <ClienteFormDialog open={formOpen} onOpenChange={setFormOpen} cliente={editingCliente} />

      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare questo cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              L'operazione non è reversibile. Lo storico appuntamenti collegato resterà comunque registrato.
            </AlertDialogDescription>
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
