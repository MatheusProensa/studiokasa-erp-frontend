import { Trophy, Check } from 'lucide-react'
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
import { formatBRL } from '@/lib/format'
import type { Cotacao } from './types'

interface Props {
  cotacao: Cotacao | null
  onOpenChange: (open: boolean) => void
  onEscolher: (cotacaoId: number, fornecedor: string) => void
}

export function CotacaoDetailSheet({ cotacao, onOpenChange, onEscolher }: Props) {
  if (!cotacao) return null
  const c = cotacao
  const menorValor = Math.min(...c.propostas.map((p) => p.valorTotal))
  const menorPrazo = Math.min(...c.propostas.map((p) => p.prazoDias))

  return (
    <Sheet open={Boolean(cotacao)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{c.codigo}</Badge>
            <StatusBadge tone={c.status === 'fechada' ? 'success' : 'info'}>
              {c.status === 'fechada' ? 'Fechada' : 'Aberta'}
            </StatusBadge>
          </div>
          <SheetTitle>{c.descricao}</SheetTitle>
          <SheetDescription>{c.itens.length} itens · {c.propostas.length} propostas</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          {/* Itens */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold">Itens cotados</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {c.itens.map((i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-muted-foreground" />
                  {i}
                </li>
              ))}
            </ul>
          </section>

          <Separator />

          {/* Comparação de propostas */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Comparação de propostas</h3>
            <div className="space-y-2">
              {c.propostas.map((p) => {
                const melhorValor = p.valorTotal === menorValor
                const melhorPrazo = p.prazoDias === menorPrazo
                return (
                  <div
                    key={p.fornecedor}
                    className={`rounded-lg border p-3 ${
                      p.vencedora ? 'border-[var(--status-success)]/50 bg-[var(--status-success-soft)]' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 font-medium">
                        {p.fornecedor}
                        {p.vencedora && (
                          <StatusBadge tone="success">
                            <Trophy className="size-3" /> Vencedora
                          </StatusBadge>
                        )}
                      </span>
                      {c.status === 'aberta' && (
                        <Button size="sm" variant="outline" onClick={() => onEscolher(c.id, p.fornecedor)}>
                          <Check className="size-4" /> Escolher
                        </Button>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                      <span className="tabular-nums">
                        <span className="text-muted-foreground">Total: </span>
                        <strong>{formatBRL(p.valorTotal)}</strong>
                        {melhorValor && <Badge variant="secondary" className="ml-2">Menor preço</Badge>}
                      </span>
                      <span>
                        <span className="text-muted-foreground">Prazo: </span>
                        <strong>{p.prazoDias} dias</strong>
                        {melhorPrazo && <Badge variant="secondary" className="ml-2">Mais rápido</Badge>}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}
