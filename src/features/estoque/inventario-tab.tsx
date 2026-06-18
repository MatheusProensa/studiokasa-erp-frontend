import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { DataTable } from '@/components/data-table/data-table'
import { INVENTARIO } from './mock-data'
import type { InventarioLinha } from './types'

export function InventarioTab() {
  const columns = useMemo<ColumnDef<InventarioLinha>[]>(
    () => [
      {
        accessorKey: 'sku',
        header: 'SKU',
        cell: ({ row }) => <Badge variant="outline">{row.original.sku}</Badge>,
      },
      {
        accessorKey: 'item',
        header: 'Item',
        cell: ({ row }) => <span className="font-medium">{row.original.item}</span>,
      },
      {
        accessorKey: 'sistema',
        header: 'Sistema',
        cell: ({ row }) => <span className="tabular-nums">{row.original.sistema}</span>,
      },
      {
        accessorKey: 'fisico',
        header: 'Físico',
        cell: ({ row }) => <span className="tabular-nums">{row.original.fisico}</span>,
      },
      {
        id: 'divergencia',
        header: 'Divergência',
        cell: ({ row }) => {
          const diff = row.original.fisico - row.original.sistema
          if (diff === 0) return <StatusBadge tone="success">OK</StatusBadge>
          return (
            <StatusBadge tone={diff > 0 ? 'info' : 'danger'}>
              {diff > 0 ? `+${diff}` : diff}
            </StatusBadge>
          )
        },
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={INVENTARIO}
      searchPlaceholder="Buscar item..."
      emptyMessage="Sem contagem de inventário."
    />
  )
}
