import { Ban, Send, FileText } from 'lucide-react'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { Separator } from '@/components/ui/separator'
import { formatBRL, formatDateTime } from '@/lib/format'
import { MODELO_INFO, STATUS_META } from './constants'
import { useFiscal } from './fiscal-context'
import type { NotaFiscal } from './types'

interface Props {
  nota: NotaFiscal | null
  onOpenChange: (open: boolean) => void
}

export function NotaDetailSheet({ nota, onOpenChange }: Props) {
  const { cancelar, reenviar } = useFiscal()
  if (!nota) return null
  const n = nota
  const status = STATUS_META[n.status]
  const imp = n.impostos
  const totalImpostos = imp.icms + imp.pis + imp.cofins + imp.ibs + imp.cbs

  const linhas: { label: string; valor: number; reforma?: boolean }[] = [
    { label: 'ICMS', valor: imp.icms },
    { label: 'PIS', valor: imp.pis },
    { label: 'COFINS', valor: imp.cofins },
    { label: 'IBS (Reforma)', valor: imp.ibs, reforma: true },
    { label: 'CBS (Reforma)', valor: imp.cbs, reforma: true },
  ]

  return (
    <Sheet open={Boolean(nota)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{n.modelo}</Badge>
            <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
          </div>
          <SheetTitle>Nº {n.numero}</SheetTitle>
          <SheetDescription>
            {n.cliente} · {n.ambiente} · {formatDateTime(n.emitidaEm)}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          <div className="rounded-lg border p-3 text-sm text-muted-foreground">
            <FileText className="mb-1 inline size-4" /> {MODELO_INFO[n.modelo]}
          </div>

          {/* Valores */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Valor da nota</p>
              <p className="font-semibold tabular-nums">{formatBRL(n.valor)}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Total de tributos</p>
              <p className="font-semibold tabular-nums">{formatBRL(totalImpostos)}</p>
            </div>
          </div>

          <Separator />

          {/* Impostos */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold">Detalhamento de tributos</h3>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <tbody>
                  {linhas.map((l) => (
                    <tr key={l.label} className="border-b last:border-0">
                      <td className="px-3 py-2">
                        {l.label}
                        {l.reforma && (
                          <Badge variant="secondary" className="ml-2">
                            NT 2025.002
                          </Badge>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">{formatBRL(l.valor)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground">
              IBS/CBS obrigatórios a partir de 03/08/2026 (regime regular). A montagem entra na base
              do ICMS — sem ISS separado.
            </p>
          </section>

          {/* Ações SEFAZ */}
          {(n.status === 'autorizada' || n.status === 'rejeitada') && (
            <div className="flex flex-wrap gap-2">
              {n.status === 'rejeitada' && (
                <Button
                  onClick={() => {
                    reenviar(n.id)
                    toast.success('Nota retransmitida e autorizada.')
                  }}
                >
                  <Send className="size-4" /> Retransmitir
                </Button>
              )}
              {n.status === 'autorizada' && (
                <Button
                  variant="outline"
                  onClick={() => {
                    cancelar(n.id)
                    toast.success('Nota cancelada na SEFAZ.')
                  }}
                >
                  <Ban className="size-4" /> Cancelar nota
                </Button>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
