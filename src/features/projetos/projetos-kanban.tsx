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
import { ETAPAS } from './constants'
import { useProjetos } from './projetos-context'
import { ProjetoDetailSheet } from './projeto-detail-sheet'
import type { Projeto } from './types'

export function ProjetosKanban() {
  const { projetos, moverEtapa } = useProjetos()
  const [detail, setDetail] = useState<Projeto | null>(null)

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {ETAPAS.map((etapa) => {
          const items = projetos.filter((p) => p.etapa === etapa.key)
          const total = items.reduce((sum, p) => sum + p.valor, 0)
          return (
            <div key={etapa.key} className="flex w-72 shrink-0 flex-col">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusBadge tone={etapa.tone}>{etapa.label}</StatusBadge>
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
                {items.map((p) => (
                  <div
                    key={p.id}
                    className="cursor-pointer rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
                    onClick={() => setDetail(p)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col leading-tight">
                        <span className="text-sm font-semibold">{p.ambiente}</span>
                        <span className="text-xs text-muted-foreground">{p.cliente}</span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                            aria-label="Mover etapa"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoveRight className="size-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuLabel>Mover para</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {ETAPAS.filter((s) => s.key !== p.etapa).map((s) => (
                            <DropdownMenuItem key={s.key} onClick={() => moverEtapa(p.id, s.key)}>
                              {s.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="mt-1 text-sm font-bold tabular-nums">{formatBRL(p.valor)}</p>

                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <Badge variant="secondary">{p.software}</Badge>
                      <Badge variant="outline">v{p.versao}</Badge>
                      {p.aprovado && <StatusBadge tone="success">Aprovado</StatusBadge>}
                    </div>

                    <div className="mt-2.5 flex items-center gap-2 border-t pt-2 text-xs text-muted-foreground">
                      <NameAvatar name={p.projetista} size="sm" />
                      {p.projetista}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <ProjetoDetailSheet projeto={detail} onOpenChange={(o) => !o && setDetail(null)} />
    </>
  )
}
