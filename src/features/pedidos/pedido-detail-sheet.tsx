import { useState } from 'react'
import { ArrowRight, AlertTriangle, Plus, CalendarClock } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/ui/status-badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatBRL, formatDate } from '@/lib/format'
import {
  STATUS_FLOW,
  STATUS_META,
  DIVERGENCIA_META,
  type DivergenciaTipo,
} from './constants'
import { estaAtrasado, proximoStatus, usePedidos } from './pedidos-context'
import type { Pedido } from './types'

interface Props {
  pedido: Pedido | null
  onOpenChange: (open: boolean) => void
}

export function PedidoDetailSheet({ pedido, onOpenChange }: Props) {
  const { avancarStatus, registrarDivergencia } = usePedidos()
  const [tipo, setTipo] = useState<DivergenciaTipo | ''>('')
  const [descricao, setDescricao] = useState('')

  if (!pedido) return null
  const p = pedido
  const status = STATUS_META[p.status]
  const next = proximoStatus(p.status)
  const atrasado = estaAtrasado(p)

  function addDivergencia() {
    if (!tipo || !descricao) return
    registrarDivergencia(p.id, { tipo, descricao })
    toast.success('Divergência registrada.')
    setTipo('')
    setDescricao('')
  }

  return (
    <Sheet open={Boolean(pedido)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{p.codigo}</Badge>
            <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
            {atrasado && <StatusBadge tone="danger">Atrasado</StatusBadge>}
          </div>
          <SheetTitle>{p.ambiente}</SheetTitle>
          <SheetDescription>
            {p.fornecedor} · {p.projeto}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          {/* Resumo */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Valor</p>
              <p className="font-semibold tabular-nums">{formatBRL(p.valor)}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarClock className="size-3" /> Prazo de entrega
              </p>
              <p className={`font-semibold ${atrasado ? 'text-[var(--status-danger)]' : ''}`}>
                {formatDate(p.prazoEntrega)}
              </p>
            </div>
          </div>

          {/* Trilha de status */}
          <div className="flex flex-wrap items-center gap-1.5">
            {STATUS_FLOW.map((s, i) => {
              const reached = STATUS_FLOW.indexOf(p.status) >= i
              return (
                <span key={s} className="flex items-center gap-1.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      reached
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {STATUS_META[s].label}
                  </span>
                  {i < STATUS_FLOW.length - 1 && (
                    <ArrowRight className="size-3 text-muted-foreground" />
                  )}
                </span>
              )
            })}
          </div>

          {next && (
            <Button onClick={() => avancarStatus(p.id)}>
              <ArrowRight className="size-4" />
              Avançar para {STATUS_META[next].label}
            </Button>
          )}

          <Separator />

          {/* Itens */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Itens do pedido ({p.itens.length})</h3>
            {p.itens.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum item importado do projeto.</p>
            ) : (
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Peça</th>
                      <th className="px-3 py-2 text-right font-semibold">Qtd</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.itens.map((it, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-3 py-2">{it.nome}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{it.qtd}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <Separator />

          {/* Divergências */}
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="size-4 text-muted-foreground" />
              Divergências ({p.divergencias.length})
            </h3>
            {p.divergencias.map((d, i) => (
              <div key={i} className="rounded-lg border p-3 text-sm">
                <StatusBadge tone="danger">{DIVERGENCIA_META[d.tipo]}</StatusBadge>
                <p className="mt-1.5 text-muted-foreground">{d.descricao}</p>
              </div>
            ))}

            <div className="space-y-2 rounded-lg border border-dashed p-3">
              <Select value={tipo} onValueChange={(v) => setTipo(v as DivergenciaTipo)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de divergência" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(DIVERGENCIA_META) as DivergenciaTipo[]).map((t) => (
                    <SelectItem key={t} value={t}>
                      {DIVERGENCIA_META[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Descreva a divergência..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
              <Button variant="outline" size="sm" disabled={!tipo || !descricao} onClick={addDivergencia}>
                <Plus className="size-4" /> Registrar divergência
              </Button>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}
