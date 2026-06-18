import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { NameAvatar } from '@/components/ui/name-avatar'
import { DataTable } from '@/components/data-table/data-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { formatBRL } from '@/lib/format'
import { ETAPA_MAP } from './constants'
import { useProjetos } from './projetos-context'
import { ProjetoDetailSheet } from './projeto-detail-sheet'
import { ProjetoFormDialog } from './projeto-form-dialog'
import type { Projeto } from './types'

export function ProjetosTable() {
  const { projetosVisiveis: projetos, remover } = useProjetos()
  const [detail, setDetail] = useState<Projeto | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Projeto | null>(null)
  const [deleting, setDeleting] = useState<Projeto | null>(null)

  function handleNew() {
    setEditing(null)
    setFormOpen(true)
  }

  function confirmDelete() {
    if (!deleting) return
    remover(deleting.id)
    toast.success(`Projeto ${deleting.codigo} excluído.`)
    setDeleting(null)
  }

  const columns = useMemo<ColumnDef<Projeto>[]>(
    () => [
      {
        accessorKey: 'codigo',
        header: 'Código',
        cell: ({ row }) => <Badge variant="outline">{row.original.codigo}</Badge>,
      },
      {
        accessorKey: 'ambiente',
        header: 'Projeto',
        cell: ({ row }) => (
          <div className="flex flex-col leading-tight">
            <span className="font-medium">{row.original.ambiente}</span>
            <span className="text-xs text-muted-foreground">{row.original.cliente}</span>
          </div>
        ),
      },
      {
        accessorKey: 'projetista',
        header: 'Projetista',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <NameAvatar name={row.original.projetista} size="sm" />
            {row.original.projetista}
          </div>
        ),
      },
      {
        accessorKey: 'etapa',
        header: 'Etapa',
        cell: ({ row }) => {
          const e = ETAPA_MAP[row.original.etapa]
          return <StatusBadge tone={e.tone}>{e.label}</StatusBadge>
        },
      },
      {
        accessorKey: 'valor',
        header: 'Valor',
        cell: ({ row }) => <span className="tabular-nums">{formatBRL(row.original.valor)}</span>,
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8" aria-label="Ações">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setDetail(row.original)}>
                  <Eye className="mr-2 size-4" />
                  Ver detalhes
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setEditing(row.original)
                    setFormOpen(true)
                  }}
                >
                  <Pencil className="mr-2 size-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDeleting(row.original)} className="text-destructive">
                  <Trash2 className="mr-2 size-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [],
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={projetos}
        searchPlaceholder="Buscar projeto, cliente..."
        emptyMessage="Nenhum projeto cadastrado."
        toolbar={
          <Button onClick={handleNew}>
            <Plus className="size-4" />
            Novo projeto
          </Button>
        }
      />

      <ProjetoDetailSheet projeto={detail} onOpenChange={(o) => !o && setDetail(null)} />
      <ProjetoFormDialog open={formOpen} onOpenChange={setFormOpen} projeto={editing} />

      <AlertDialog open={Boolean(deleting)} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir projeto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação removerá <strong>{deleting?.codigo}</strong> ({deleting?.ambiente}). Não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
