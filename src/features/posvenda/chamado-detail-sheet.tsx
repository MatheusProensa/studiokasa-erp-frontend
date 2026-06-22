import { useState } from 'react'
import { Wrench, PackagePlus, CheckCircle2 } from 'lucide-react'
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
import { NameAvatar } from '@/components/ui/name-avatar'
import { formatDateTime } from '@/lib/format'
import { CHAMADO_STATUS_META, PRIORIDADE_META } from './constants'
import { usePosvenda } from './posvenda-context'
import type { Chamado } from './types'
import { PEDIDOS } from '@/features/pedidos/mock-data'

interface Props {
  chamado: Chamado | null
  onOpenChange: (open: boolean) => void
}

export function ChamadoDetailSheet({ chamado, onOpenChange }: Props) {
  const { atender, solicitarPeca, encerrar } = usePosvenda()
  const [peca, setPeca] = useState('')

  if (!chamado) return null
  const c = chamado
  const status = CHAMADO_STATUS_META[c.status]
  const prioridade = PRIORIDADE_META[c.prioridade]

  return (
    <Sheet open={Boolean(chamado)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{c.codigo}</Badge>
            <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
            <StatusBadge tone={prioridade.tone}>Prioridade {prioridade.label}</StatusBadge>
          </div>
          <SheetTitle>{c.assunto}</SheetTitle>
          <SheetDescription>
            {c.cliente} · {c.projeto} · aberto {formatDateTime(c.abertoEm)}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          <div className="flex items-center gap-2 rounded-lg border p-3 text-sm">
            <NameAvatar name={c.tecnico} size="sm" />
            <div className="flex flex-col leading-tight">
              <span className="font-medium">{c.tecnico}</span>
              <span className="text-xs text-muted-foreground">Técnico responsável</span>
            </div>
          </div>

          {c.pecaSolicitada && (
            <div className="flex items-center gap-2 rounded-lg border p-3 text-sm">
              <PackagePlus className="size-4 text-muted-foreground" />
              Reposição solicitada: <strong>{c.pecaSolicitada}</strong>
            </div>
          )}

          {c.status !== 'encerrado' && (
            <>
              <Separator />
              <section className="space-y-3">
                <h3 className="text-sm font-semibold">Ações</h3>
                {c.status === 'aberto' && (
                  <Button onClick={() => { atender(c.id); toast.success('Chamado em atendimento.') }}>
                    <Wrench className="size-4" /> Iniciar atendimento
                  </Button>
                )}
                <div className="flex items-end gap-2">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs text-muted-foreground">Solicitar reposição de peça</label>
                    <Input placeholder="Ex: Corrediça 450mm" value={peca} onChange={(e) => setPeca(e.target.value)} />
                  </div>
                  <Button
                    variant="outline"
                    disabled={!peca}
                    onClick={() => {
                      solicitarPeca(c.id, peca)
                      const novoId = Math.max(0, ...PEDIDOS.map((p) => p.id)) + 1
                      PEDIDOS.unshift({
                        id: novoId,
                        codigo: `PC-${2000 + novoId}`,
                        projeto: c.projeto,
                        ambiente: `Reposição — ${c.assunto}`,
                        fornecedor: 'A definir',
                        status: 'em-producao',
                        prazoEntrega: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
                        valor: 0,
                        itens: [{ nome: peca, qtd: 1 }],
                        divergencias: [],
                      })
                      toast.success('Pedido de reposição gerado ao fornecedor — confira em Pedido ao Fornecedor.')
                      setPeca('')
                    }}
                  >
                    <PackagePlus className="size-4" /> Solicitar
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => { encerrar(c.id); toast.success('Chamado encerrado.') }}
                >
                  <CheckCircle2 className="size-4" /> Encerrar chamado
                </Button>
              </section>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
