import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { NameAvatar } from '@/components/ui/name-avatar'
import { DataTable } from '@/components/data-table/data-table'
import { formatBRL } from '@/lib/format'
import { STAGE_MAP, SCORE_META } from './constants'
import { DEALS } from './mock-data'
import type { Deal } from './types'

export function OportunidadesTab() {
  const columns = useMemo<ColumnDef<Deal>[]>(
    () => [
      { accessorKey: 'cliente', header: 'Cliente', cell: ({ row }) => <span className="font-medium">{row.original.cliente}</span> },
      {
        accessorKey: 'origem',
        header: 'Origem',
        cell: ({ row }) => <Badge variant="secondary">{row.original.origem}</Badge>,
      },
      {
        accessorKey: 'etapa',
        header: 'Etapa',
        cell: ({ row }) => {
          const stage = STAGE_MAP[row.original.etapa]
          return <StatusBadge tone={stage.tone}>{stage.label}</StatusBadge>
        },
      },
      {
        accessorKey: 'score',
        header: 'Score',
        cell: ({ row }) => {
          const s = SCORE_META[row.original.score]
          return <StatusBadge tone={s.tone}>{s.label}</StatusBadge>
        },
      },
      {
        accessorKey: 'valor',
        header: 'Valor',
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.valor > 0 ? formatBRL(row.original.valor) : '—'}</span>
        ),
      },
      {
        accessorKey: 'vendedor',
        header: 'Vendedor',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <NameAvatar name={row.original.vendedor} size="sm" />
            {row.original.vendedor}
          </div>
        ),
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={DEALS}
      searchPlaceholder="Buscar oportunidade..."
      emptyMessage="Nenhuma oportunidade."
    />
  )
}
