import { History, Package, BadgeCheck } from 'lucide-react'
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
import { NameAvatar } from '@/components/ui/name-avatar'
import { formatBRL, formatDateTime } from '@/lib/format'
import { ETAPA_MAP } from './constants'
import { useProjetos } from './projetos-context'
import type { Projeto } from './types'

interface ProjetoDetailSheetProps {
  projeto: Projeto | null
  onOpenChange: (open: boolean) => void
}

export function ProjetoDetailSheet({ projeto, onOpenChange }: ProjetoDetailSheetProps) {
  const { aprovar } = useProjetos()
  if (!projeto) return null
  const etapa = ETAPA_MAP[projeto.etapa]

  return (
    <Sheet open={Boolean(projeto)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{projeto.codigo}</Badge>
            <StatusBadge tone={etapa.tone}>{etapa.label}</StatusBadge>
            {projeto.aprovado ? (
              <StatusBadge tone="success">Aprovado</StatusBadge>
            ) : (
              <StatusBadge tone="warning">Aguardando aprovação</StatusBadge>
            )}
          </div>
          <SheetTitle>{projeto.ambiente}</SheetTitle>
          <SheetDescription>
            {projeto.cliente} · atualizado em {formatDateTime(projeto.atualizadoEm)}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          {/* Resumo */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Info label="Projetista">
              <div className="flex items-center gap-2">
                <NameAvatar name={projeto.projetista} size="sm" />
                {projeto.projetista}
              </div>
            </Info>
            <Info label="Valor">
              <span className="font-semibold tabular-nums">{formatBRL(projeto.valor)}</span>
            </Info>
            <Info label="Software 3D">
              <Badge variant="secondary">{projeto.software}</Badge>
            </Info>
            <Info label="Versão atual">v{projeto.versao}</Info>
          </div>

          {!projeto.aprovado && (
            <Button onClick={() => aprovar(projeto.id)} className="w-full">
              <BadgeCheck className="size-4" />
              Aprovar projeto
            </Button>
          )}

          <Separator />

          {/* Versões */}
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <History className="size-4 text-muted-foreground" />
              Histórico de versões
            </h3>
            <ol className="space-y-3">
              {projeto.versoes.map((v) => (
                <li key={v.numero} className="flex gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-primary">
                    {v.numero}
                  </span>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-medium">{v.resumo}</span>
                    <span className="text-xs text-muted-foreground">
                      {v.autor} · {formatDateTime(v.data)}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <Separator />

          {/* Peças */}
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Package className="size-4 text-muted-foreground" />
              Lista de peças ({projeto.pecas.length})
            </h3>
            {projeto.pecas.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma peça importada — depende da sincronização com o projeto 3D.
              </p>
            ) : (
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Peça</th>
                      <th className="px-3 py-2 font-semibold">Acabamento</th>
                      <th className="px-3 py-2 text-right font-semibold">Qtd</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projeto.pecas.map((p, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-3 py-2">{p.nome}</td>
                        <td className="px-3 py-2 text-muted-foreground">{p.acabamento}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{p.qtd}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span>{children}</span>
    </div>
  )
}
