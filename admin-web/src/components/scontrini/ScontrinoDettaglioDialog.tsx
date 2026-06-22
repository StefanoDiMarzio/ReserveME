import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Scontrino } from "@/lib/api/types"

export function ScontrinoDettaglioDialog({
  open,
  onOpenChange,
  scontrino,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  scontrino: Scontrino | null
}) {
  if (!scontrino) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {scontrino.tipoDocumento === "FATTURA" ? "Fattura" : "Scontrino"} #{scontrino.numeroDocumento}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Data emissione</span>
            <span>{new Date(scontrino.dataEmissione).toLocaleString("it-IT")}</span>
          </div>
          {scontrino.cliente && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Cliente</span>
              <span>
                {scontrino.cliente.nome} {scontrino.cliente.cognome}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Metodo pagamento</span>
            <span>{scontrino.metodoPagamento}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Stato</span>
            <Badge variant={scontrino.stato === "ANNULLATO" ? "destructive" : "default"}>{scontrino.stato}</Badge>
          </div>

          <div className="rounded-md border border-border">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Voce</th>
                  <th className="px-3 py-2 text-right">Qtà</th>
                  <th className="px-3 py-2 text-right">Prezzo</th>
                  <th className="px-3 py-2 text-right">Subtotale</th>
                </tr>
              </thead>
              <tbody>
                {scontrino.voci.map((v) => (
                  <tr key={v.id} className="border-b border-border last:border-0">
                    <td className="px-3 py-2">{v.descrizione}</td>
                    <td className="px-3 py-2 text-right">{v.quantita}</td>
                    <td className="px-3 py-2 text-right">€{v.prezzoUnitario.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">€{v.subtotale.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-base font-semibold">
            <span>Totale</span>
            <span>€{scontrino.totale.toFixed(2)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
