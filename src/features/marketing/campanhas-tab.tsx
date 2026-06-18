import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { DataTable } from '@/components/data-table/data-table'
import { formatBRL } from '@/lib/format'
import { CAMPANHA_STATUS_META } from './constants'
import { CAMPANHAS } from './mock-data'
import type { Campanha } from './types'

export function CampanhasTab() {
  const columns = useMemo<ColumnDef<Campanha>[]>(
    () => [
      { accessorKey: 'nome', header: 'Campanha', cell: ({ row }) => <span className="font-medium">{row.original.nome}</span> },
      { accessorKey: 'canal', header: 'Canal', cell: ({ row }) => <Badge variant="secondary">{row.original.canal}</Badge> },
      {
        accessorKey: 'investimento',
        header: 'Investimento',
        cell: ({ row }) => <span className="tabular-nums">{formatBRL(row.original.investimento)}</span>,
      },
      { accessorKey: 'leads', header: 'Leads', cell: ({ row }) => <span className="tabular-nums">{row.original.leads}</span> },
      {
        id: 'cac',
        header: 'CAC',
        cell: ({ row }) => (
          <span className="tabular-nums">
            {row.original.leads > 0 ? formatBRL(row.original.investimento / row.original.leads) : '—'}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const s = CAMPANHA_STATUS_META[row.original.status]
          return <StatusBadge tone={s.tone}>{s.label}</StatusBadge>
        },
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={CAMPANHAS}
      searchPlaceholder="Buscar campanha, canal..."
      emptyMessage="Nenhuma campanha."
    />
  )
}
