import { useState } from 'react'
import { History, Package, BadgeCheck, Pencil, Trash2, Copy } from 'lucide-react'
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
import { NameAvatar } from '@/components/ui/name-avatar'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { formatBRL, formatDateTime } from '@/lib/format'
import { ETAPA_MAP } from './constants'
import { useProjetos } from './projetos-context'
import { ProjetoFormDialog } from './projeto-form-dialog'
import type { Projeto } from './types'

interface ProjetoDetailSheetProps {
  projeto: Projeto | null
  onOpenChange: (open: boolean) => void
}

export function ProjetoDetailSheet({ projeto, onOpenChange }: ProjetoDetailSheetProps) {
  const { aprovar, remover, salvar } = useProjetos()
  const [editOpen, setEditOpen] = useState(false)
  const [confirmarExclusao, setConfirmarExclusao] = useState(false)

  if (!projeto) return null
  const etapa = ETAPA_MAP[projeto.etapa]

  const projetoAtual = projeto

  function handleExcluir() {
    remover(projetoAtual.id)
    toast.success(`Projeto ${projetoAtual.codigo} excluído.`)
    setConfirmarExclusao(false)
    onOpenChange(false)
  }

  function handleDuplicar() {
    salvar({
      cliente: projetoAtual.cliente,
      ambiente: `${projetoAtual.ambiente} (cópia)`,
      projetista: projetoAtual.projetista,
      etapa: 'projeto',
      valor: projetoAtual.valor,
      software: projetoAtual.software,
    })
    toast.success(`Projeto "${projetoAtual.codigo} – ${projetoAtual.cliente}" duplicado com sucesso.`)
    onOpenChange(false)
  }

  return (
    <Sheet open={Boolean(projeto)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{projeto.codigo}</Badge>
              <StatusBadge tone={etapa.tone}>{etapa.label}</StatusBadge>
              {projeto.aprovado ? (
                <StatusBadge tone="success">Aprovado</StatusBadge>
              ) : (
                <StatusBadge tone="warning">Aguardando aprovação</StatusBadge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="size-8" aria-label="Editar" onClick={() => setEditOpen(true)}>
                <Pencil className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" className="size-8" aria-label="Duplicar" onClick={handleDuplicar}>
                <Copy className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" className="size-8 text-destructive" aria-label="Excluir" onClick={() => setConfirmarExclusao(true)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
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

      <ProjetoFormDialog open={editOpen} onOpenChange={setEditOpen} projeto={projeto} />

      <AlertDialog open={confirmarExclusao} onOpenChange={setConfirmarExclusao}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir projeto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação removerá <strong>{projeto.codigo}</strong> ({projeto.ambiente}). Não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleExcluir} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
