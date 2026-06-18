import { useState } from 'react'
import { LogIn, LogOut, ShieldAlert, Check, X, Unlock } from 'lucide-react'
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
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { StatusBadge } from '@/components/ui/status-badge'
import { Separator } from '@/components/ui/separator'
import { NameAvatar } from '@/components/ui/name-avatar'
import { formatBRL, formatDateTime } from '@/lib/format'
import { LIMITE_DIVERGENCIA, STATUS_META } from './constants'
import { divergencia, estourouAlcada, useMedicoes } from './medicoes-context'
import type { Medicao } from './types'

interface Props {
  medicao: Medicao | null
  onOpenChange: (open: boolean) => void
}

export function MedicaoDetailSheet({ medicao, onOpenChange }: Props) {
  const { checkIn, checkOut, toggleItem, conferirValor, aprovar, reprovar, liberarAlcada } =
    useMedicoes()
  const [valorInput, setValorInput] = useState('')

  if (!medicao) return null
  const m = medicao
  const status = STATUS_META[m.status]
  const div = divergencia(m)
  const estourou = estourouAlcada(m)
  const totalItens = m.checklist.reduce((s, g) => s + g.itens.length, 0)
  const okItens = m.checklist.reduce((s, g) => s + g.itens.filter((i) => i.ok).length, 0)

  return (
    <Sheet open={Boolean(medicao)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{m.codigo}</Badge>
            <Badge variant={m.tipo === 'final' ? 'default' : 'secondary'}>
              {m.tipo === 'final' ? 'Final' : 'Preliminar'}
            </Badge>
            <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
          </div>
          <SheetTitle>{m.ambiente}</SheetTitle>
          <SheetDescription>
            {m.cliente} · {m.projeto} · {formatDateTime(m.agendaInicio)}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          {/* Conferente + check-in/out */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-2 text-sm">
              <NameAvatar name={m.conferente} size="sm" />
              <div className="flex flex-col leading-tight">
                <span className="font-medium">{m.conferente}</span>
                <span className="text-xs text-muted-foreground">
                  {m.checkIn ? `Check-in ${formatDateTime(m.checkIn)}` : 'Sem check-in'}
                  {m.checkOut && ` · Check-out ${formatDateTime(m.checkOut)}`}
                </span>
              </div>
            </div>
            {!m.checkIn ? (
              <Button size="sm" variant="outline" onClick={() => checkIn(m.id)}>
                <LogIn className="size-4" /> Check-in
              </Button>
            ) : !m.checkOut ? (
              <Button size="sm" variant="outline" onClick={() => checkOut(m.id)}>
                <LogOut className="size-4" /> Check-out
              </Button>
            ) : null}
          </div>

          {/* Checklist */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Checklist de medição</h3>
              <span className="text-xs text-muted-foreground">
                {okItens}/{totalItens} conferidos
              </span>
            </div>
            {m.checklist.map((grupo, gi) => (
              <div key={grupo.categoria} className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {grupo.categoria}
                </p>
                {grupo.itens.map((item, ii) => (
                  <label
                    key={item.label}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg border p-2.5 text-sm hover:bg-accent/50"
                  >
                    <Checkbox checked={item.ok} onCheckedChange={() => toggleItem(m.id, gi, ii)} />
                    {item.label}
                  </label>
                ))}
              </div>
            ))}
          </section>

          <Separator />

          {/* Comparação vendido × conferido */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Vendido × Conferido</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Valor vendido</p>
                <p className="font-semibold tabular-nums">{formatBRL(m.valorVendido)}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Valor conferido</p>
                <p className="font-semibold tabular-nums">
                  {m.valorConferido != null ? formatBRL(m.valorConferido) : '—'}
                </p>
              </div>
            </div>

            {m.valorConferido == null ? (
              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="vc" className="text-xs">
                    Registrar valor conferido
                  </Label>
                  <Input
                    id="vc"
                    type="number"
                    placeholder="0,00"
                    value={valorInput}
                    onChange={(e) => setValorInput(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  disabled={!valorInput}
                  onClick={() => {
                    conferirValor(m.id, Number(valorInput))
                    setValorInput('')
                  }}
                >
                  Registrar
                </Button>
              </div>
            ) : (
              <div
                className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
                  estourou ? 'border-[var(--status-danger)]/40 bg-[var(--status-danger-soft)]' : ''
                }`}
              >
                {estourou && <ShieldAlert className="size-4 text-[var(--status-danger)]" />}
                <span>
                  Divergência:{' '}
                  <strong className={estourou ? 'text-[var(--status-danger)]' : ''}>
                    {div != null ? `${(div * 100).toFixed(1)}%` : '—'}
                  </strong>{' '}
                  <span className="text-muted-foreground">
                    (limite {(LIMITE_DIVERGENCIA * 100).toFixed(0)}%)
                  </span>
                  {estourou && !m.liberadaManual && (
                    <span className="text-[var(--status-danger)]">
                      {' '}
                      — exige liberação por alçada.
                    </span>
                  )}
                </span>
              </div>
            )}
          </section>

          {/* Ações de aprovação */}
          {['conferida', 'em-andamento', 'bloqueada'].includes(m.status) && (
            <div className="flex flex-wrap gap-2">
              {m.status === 'bloqueada' ? (
                <Button onClick={() => liberarAlcada(m.id)}>
                  <Unlock className="size-4" /> Liberar por alçada
                </Button>
              ) : (
                <Button onClick={() => aprovar(m.id)} disabled={m.valorConferido == null}>
                  <Check className="size-4" /> Aprovar
                </Button>
              )}
              <Button variant="outline" onClick={() => reprovar(m.id)}>
                <X className="size-4" /> Reprovar
              </Button>
            </div>
          )}

          {m.status === 'aprovada' && m.tipo === 'final' && (
            <div className="flex items-center gap-2 rounded-lg border border-[var(--status-success)]/40 bg-[var(--status-success-soft)] p-3 text-sm">
              <Check className="size-4 text-[var(--status-success)]" />
              Medição final aprovada — pedido ao fornecedor liberado (Módulo 4).
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
