import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { NameAvatar } from '@/components/ui/name-avatar'
import { DataTable } from '@/components/data-table/data-table'
import { formatBRL } from '@/lib/format'
import { PARCEIROS, type Parceiro } from './mock-data'

export function ParceirosTab() {
  const columns = useMemo<ColumnDef<Parceiro>[]>(
    () => [
      {
        accessorKey: 'nome',
        header: 'Parceiro',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <NameAvatar name={row.original.nome} size="md" />
            <span className="font-medium">{row.original.nome}</span>
          </div>
        ),
      },
      { accessorKey: 'tipo', header: 'Tipo', cell: ({ row }) => <Badge variant="secondary">{row.original.tipo}</Badge> },
      {
        accessorKey: 'comissaoMes',
        header: 'Comissão (mês)',
        cell: ({ row }) => <span className="tabular-nums">{formatBRL(row.original.comissaoMes)}</span>,
      },
      {
        accessorKey: 'ativo',
        header: 'Status',
        cell: ({ row }) =>
          row.original.ativo ? (
            <StatusBadge tone="success">Ativo</StatusBadge>
          ) : (
            <StatusBadge tone="neutral">Inativo</StatusBadge>
          ),
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={PARCEIROS}
      searchPlaceholder="Buscar parceiro..."
      emptyMessage="Nenhum parceiro."
    />
  )
}
