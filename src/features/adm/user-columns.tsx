import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { NameAvatar } from '@/components/ui/name-avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ROLE_LABELS } from '@/lib/roles'
import { formatDateTime } from '@/lib/format'
import type { SystemUser } from './types'

interface ColumnActions {
  onEdit: (user: SystemUser) => void
  onDelete: (user: SystemUser) => void
}

export function buildUserColumns({ onEdit, onDelete }: ColumnActions): ColumnDef<SystemUser>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Usuário',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <NameAvatar name={row.original.name} size="md" />
          <div className="flex flex-col leading-tight">
            <span className="font-medium">{row.original.name}</span>
            <span className="text-xs text-muted-foreground">{row.original.email}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'roles',
      header: 'Papéis',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.roles.map((r) => (
            <Badge key={r} variant="secondary">
              {ROLE_LABELS[r]}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'unidade',
      header: 'Unidade',
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.unidade}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) =>
        row.original.status === 'ativo' ? (
          <StatusBadge tone="success">Ativo</StatusBadge>
        ) : (
          <StatusBadge tone="neutral">Inativo</StatusBadge>
        ),
    },
    {
      accessorKey: 'lastAccess',
      header: 'Último acesso',
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.lastAccess ? formatDateTime(row.original.lastAccess) : '—'}
        </span>
      ),
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
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                <Pencil className="mr-2 size-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(row.original)}
                className="text-destructive"
              >
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
