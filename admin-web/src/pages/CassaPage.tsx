import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react"
import { toast } from "sonner"

import { chiudiCassa, getCassa, getChiusure, getMovimenti } from "@/lib/api/cassa"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function formatEuro(value: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(value)
}

export function CassaPage() {
  const queryClient = useQueryClient()
  const [chiusuraOpen, setChiusuraOpen] = useState(false)
  const [note, setNote] = useState("")

  const { data: cassa, isLoading: loadingCassa } = useQuery({ queryKey: ["cassa"], queryFn: getCassa })
  const { data: movimenti, isLoading: loadingMovimenti } = useQuery({
    queryKey: ["cassa", "movimenti"],
    queryFn: getMovimenti,
  })
  const { data: chiusure } = useQuery({ queryKey: ["cassa", "chiusure"], queryFn: getChiusure })

  const chiusuraMutation = useMutation({
    mutationFn: () => chiudiCassa(note.trim() || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cassa"] })
      toast.success("Chiusura cassa effettuata")
      setChiusuraOpen(false)
      setNote("")
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Cassa</h1>
          <p className="mt-1 text-muted-foreground">Saldi, movimenti e chiusure</p>
        </div>
        <Button onClick={() => setChiusuraOpen(true)}>
          <Wallet className="h-4 w-4" />
          Chiudi cassa
        </Button>
      </div>

      {loadingCassa ? (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo contanti</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{formatEuro(cassa?.saldoContanti ?? 0)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo POS</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{formatEuro(cassa?.saldoPos ?? 0)}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="movimenti" className="mt-8">
        <TabsList>
          <TabsTrigger value="movimenti">Movimenti</TabsTrigger>
          <TabsTrigger value="chiusure">Storico chiusure</TabsTrigger>
        </TabsList>

        <TabsContent value="movimenti">
          <div className="mt-4 rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Metodo</TableHead>
                  <TableHead>Descrizione</TableHead>
                  <TableHead className="text-right">Importo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingMovimenti ? (
                  [0, 1, 2].map((i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : movimenti?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Nessun movimento registrato.
                    </TableCell>
                  </TableRow>
                ) : (
                  movimenti?.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>{new Date(m.data).toLocaleString("it-IT")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {m.tipo === "ENTRATA" ? (
                            <ArrowUpCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowDownCircle className="h-4 w-4 text-destructive" />
                          )}
                          {m.tipo}
                        </div>
                      </TableCell>
                      <TableCell>{m.metodo}</TableCell>
                      <TableCell>{m.descrizione ?? "—"}</TableCell>
                      <TableCell className="text-right font-medium">{formatEuro(m.importo)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="chiusure">
          <div className="mt-4 rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data chiusura</TableHead>
                  <TableHead>Totale contanti</TableHead>
                  <TableHead>Totale POS</TableHead>
                  <TableHead>Totale generale</TableHead>
                  <TableHead>Documenti</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chiusure?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Nessuna chiusura effettuata.
                    </TableCell>
                  </TableRow>
                ) : (
                  chiusure?.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>{new Date(c.dataChiusura).toLocaleString("it-IT")}</TableCell>
                      <TableCell>{formatEuro(c.totaleContanti)}</TableCell>
                      <TableCell>{formatEuro(c.totalePos)}</TableCell>
                      <TableCell className="font-medium">{formatEuro(c.totaleGenerale)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {c.numScontrini} scontrini · {c.numFatture} fatture
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={chiusuraOpen} onOpenChange={setChiusuraOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confermi la chiusura cassa?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Verranno calcolati i totali da tutti i documenti emessi dall'ultima chiusura e i saldi della cassa
            verranno azzerati.
          </p>
          <Textarea placeholder="Note (opzionale)" value={note} onChange={(e) => setNote(e.target.value)} />
          <DialogFooter>
            <Button onClick={() => chiusuraMutation.mutate()} disabled={chiusuraMutation.isPending}>
              {chiusuraMutation.isPending ? "Chiusura in corso..." : "Conferma chiusura"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
