import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Pencil, Trash2, FolderKanban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NameAvatar } from '@/components/ui/name-avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Cliente } from './types'

interface ColumnActions {
  onEdit: (c: Cliente) => void
  onDelete: (c: Cliente) => void
  onVerProjetos: (c: Cliente) => void
}

export function buildClienteColumns({ onEdit, onDelete, onVerProjetos }: ColumnActions): ColumnDef<Cliente>[] {
  return [
    {
      accessorKey: 'nome',
      header: 'Cliente',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <NameAvatar name={row.original.nome} size="md" />
          <div className="flex flex-col leading-tight">
            <span className="font-medium">{row.original.nome}</span>
            <span className="text-xs text-muted-foreground">{row.original.email}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'tipo',
      header: 'Tipo',
      cell: ({ row }) => <Badge variant="outline">{row.original.tipo}</Badge>,
    },
    {
      accessorKey: 'documento',
      header: 'CPF / CNPJ',
      cell: ({ row }) => <span className="tabular-nums">{row.original.documento}</span>,
    },
    { accessorKey: 'telefone', header: 'Telefone' },
    {
      accessorKey: 'cidade',
      header: 'Cidade',
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.cidade}</span>,
    },
    {
      accessorKey: 'origem',
      header: 'Origem',
      cell: ({ row }) => <Badge variant="secondary">{row.original.origem}</Badge>,
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
              <DropdownMenuItem onClick={() => onVerProjetos(row.original)}>
                <FolderKanban className="mr-2 size-4" />
                Ver projetos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                <Pencil className="mr-2 size-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(row.original)} className="text-destructive">
                <Trash2 className="mr-2 size-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]
}
