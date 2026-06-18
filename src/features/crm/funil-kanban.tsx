import { useState } from 'react'
import { MoveRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { NameAvatar } from '@/components/ui/name-avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatBRL } from '@/lib/format'
import { STAGES, SCORE_META, type StageKey } from './constants'
import { DEALS } from './mock-data'
import type { Deal } from './types'

export function FunilKanban() {
  const [deals, setDeals] = useState<Deal[]>(DEALS)

  function moveDeal(id: number, etapa: StageKey) {
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, etapa } : d)))
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {STAGES.map((stage) => {
        const items = deals.filter((d) => d.etapa === stage.key)
        const total = items.reduce((sum, d) => sum + d.valor, 0)
        return (
          <div key={stage.key} className="flex w-72 shrink-0 flex-col">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusBadge tone={stage.tone}>{stage.label}</StatusBadge>
                <span className="text-xs font-medium text-muted-foreground">{items.length}</span>
              </div>
              <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                {formatBRL(total)}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-2 rounded-xl bg-muted/50 p-2">
              {items.length === 0 && (
                <p className="px-2 py-6 text-center text-xs text-muted-foreground">Vazio</p>
              )}
              {items.map((deal) => (
                <div
                  key={deal.id}
                  className="rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold leading-tight">{deal.cliente}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                          aria-label="Mover etapa"
                        >
                          <MoveRight className="size-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Mover para</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {STAGES.filter((s) => s.key !== deal.etapa).map((s) => (
                          <DropdownMenuItem key={s.key} onClick={() => moveDeal(deal.id, s.key)}>
                            {s.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {deal.valor > 0 && (
                    <p className="mt-1 text-sm font-bold tabular-nums">{formatBRL(deal.valor)}</p>
                  )}

                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary">{deal.origem}</Badge>
                    <StatusBadge tone={SCORE_META[deal.score].tone}>
                      Score {SCORE_META[deal.score].label}
                    </StatusBadge>
                  </div>

                  <div className="mt-2.5 flex items-center gap-2 border-t pt-2 text-xs text-muted-foreground">
                    <NameAvatar name={deal.vendedor} size="sm" />
                    {deal.vendedor}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
