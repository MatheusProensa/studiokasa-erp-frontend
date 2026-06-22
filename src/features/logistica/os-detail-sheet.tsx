import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, LogOut, ArrowRight, AlertTriangle, Plus, Truck, Headset, Check } from 'lucide-react'
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
import { Checkbox } from '@/components/ui/checkbox'
import { StatusBadge } from '@/components/ui/status-badge'
import { Separator } from '@/components/ui/separator'
import { NameAvatar } from '@/components/ui/name-avatar'
import { formatDateTime } from '@/lib/format'
import { OS_STATUS_META, proximoStatus } from './constants'
import { useLogistica } from './logistica-context'
import type { OrdemServico } from './types'

interface Props {
  os: OrdemServico | null
  onOpenChange: (open: boolean) => void
}

export function OsDetailSheet({ os, onOpenChange }: Props) {
  const { checkIn, checkOut, toggleItem, avancarStatus, registrarAvaria } = useLogistica()
  const [peca, setPeca] = useState('')
  const [descricao, setDescricao] = useState('')
  const navigate = useNavigate()

  if (!os) return null
  const o = os
  const status = OS_STATUS_META[o.status]
  const next = proximoStatus(o.status)

  function addAvaria() {
    if (!peca || !descricao) return
    registrarAvaria(o.id, { peca, descricao })
    toast.success('Avaria registrada.')
    setPeca('')
    setDescricao('')
  }

  return (
    <Sheet open={Boolean(os)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{o.codigo}</Badge>
            <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
          </div>
          <SheetTitle>{o.ambiente}</SheetTitle>
          <SheetDescription>
            {o.cliente} · {formatDateTime(o.agenda)}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          {/* Equipe / veículo / check-in */}
          <div className="space-y-3 rounded-lg border p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <NameAvatar name={o.equipe} size="sm" />
                <span className="font-medium">{o.equipe}</span>
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Truck className="size-4" /> {o.veiculo}
              </span>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-xs text-muted-foreground">
                {o.checkIn ? `Check-in ${formatDateTime(o.checkIn)}` : 'Sem check-in'}
                {o.checkOut && ` · Check-out ${formatDateTime(o.checkOut)}`}
              </span>
              {!o.checkIn ? (
                <Button size="sm" variant="outline" onClick={() => checkIn(o.id)}>
                  <LogIn className="size-4" /> Check-in
                </Button>
              ) : !o.checkOut ? (
                <Button size="sm" variant="outline" onClick={() => checkOut(o.id)}>
                  <LogOut className="size-4" /> Check-out
                </Button>
              ) : null}
            </div>
          </div>

          {next && (
            <Button onClick={() => avancarStatus(o.id)}>
              <ArrowRight className="size-4" /> Avançar para {OS_STATUS_META[next].label}
            </Button>
          )}

          {o.status === 'concluida' && (
            <div className="space-y-2 rounded-lg border border-[var(--status-success)]/40 bg-[var(--status-success-soft)] p-3 text-sm">
              <div className="flex items-center gap-2">
                <Check className="size-4 text-[var(--status-success)]" />
                Entrega concluída — pós-venda disponível para abertura de chamados.
              </div>
              <Button
                size="sm"
                onClick={() => navigate(`/posvenda?cliente=${encodeURIComponent(o.cliente)}&projeto=${encodeURIComponent(o.codigo)}`)}
              >
                <Headset className="size-4" /> Abrir pós-venda
              </Button>
            </div>
          )}

          <Separator />

          {/* Checklist por fase */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Ordem de montagem</h3>
            {o.checklist.map((fase, fi) => (
              <div key={fase.fase} className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {fase.fase}
                </p>
                {fase.itens.map((item, ii) => (
                  <label
                    key={item.label}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg border p-2.5 text-sm hover:bg-accent/50"
                  >
                    <Checkbox checked={item.ok} onCheckedChange={() => toggleItem(o.id, fi, ii)} />
                    {item.label}
                  </label>
                ))}
              </div>
            ))}
          </section>

          <Separator />

          {/* Avarias */}
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="size-4 text-muted-foreground" />
              Avarias ({o.avarias.length})
            </h3>
            {o.avarias.map((a, i) => (
              <div key={i} className="rounded-lg border p-3 text-sm">
                <StatusBadge tone="danger">{a.peca}</StatusBadge>
                <p className="mt-1.5 text-muted-foreground">{a.descricao}</p>
              </div>
            ))}
            <div className="space-y-2 rounded-lg border border-dashed p-3">
              <Input placeholder="Peça avariada" value={peca} onChange={(e) => setPeca(e.target.value)} />
              <Input
                placeholder="Descrição da avaria..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
              <Button variant="outline" size="sm" disabled={!peca || !descricao} onClick={addAvaria}>
                <Plus className="size-4" /> Registrar avaria
              </Button>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}
