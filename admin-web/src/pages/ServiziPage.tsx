import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Clock, Pencil, Plus, PowerOff } from "lucide-react"
import { toast } from "sonner"

import { disattivaServizio, getServiziTutti } from "@/lib/api/servizi"
import type { Servizio } from "@/lib/api/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ServizioFormDialog } from "@/components/servizi/ServizioFormDialog"

export function ServiziPage() {
  const queryClient = useQueryClient()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Servizio | null>(null)

  const { data: servizi, isLoading } = useQuery({ queryKey: ["servizi", "tutti"], queryFn: getServiziTutti })

  const disattivaMutation = useMutation({
    mutationFn: disattivaServizio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servizi"] })
      toast.success("Servizio disattivato")
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Servizi</h1>
          <p className="mt-1 text-muted-foreground">Il menu dei trattamenti offerti dal negozio</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          Nuovo servizio
        </Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {isLoading ? (
          [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full" />)
        ) : servizi?.length === 0 ? (
          <p className="text-muted-foreground">Nessun servizio ancora creato.</p>
        ) : (
          servizi?.map((s) => (
            <Card key={s.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{s.nomeTrattamento}</p>
                  {s.descrizione && <p className="mt-1 text-sm text-muted-foreground">{s.descrizione}</p>}
                  {s.durataMinuti && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {s.durataMinuti} min
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">€{s.costo.toFixed(2)}</p>
                  <Badge variant={s.attivo ? "default" : "secondary"} className="mt-1">
                    {s.attivo ? "Attivo" : "Disattivato"}
                  </Badge>
                </div>
              </div>

              <div className="mt-3 flex justify-end gap-2 border-t border-border pt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(s)
                    setFormOpen(true)
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Modifica
                </Button>
                {s.attivo && (
                  <Button size="sm" variant="outline" onClick={() => disattivaMutation.mutate(s.id)}>
                    <PowerOff className="h-3.5 w-3.5" />
                    Disattiva
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      <ServizioFormDialog open={formOpen} onOpenChange={setFormOpen} servizio={editing} />
    </div>
  )
}
