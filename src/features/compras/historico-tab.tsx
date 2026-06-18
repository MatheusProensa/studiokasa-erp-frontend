import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table/data-table'
import { formatBRL, formatDate } from '@/lib/format'
import { HISTORICO } from './mock-data'
import type { HistoricoPreco } from './types'

export function HistoricoTab() {
  const columns = useMemo<ColumnDef<HistoricoPreco>[]>(
    () => [
      {
        accessorKey: 'item',
        header: 'Item',
        cell: ({ row }) => <span className="font-medium">{row.original.item}</span>,
      },
      { accessorKey: 'fornecedor', header: 'Fornecedor' },
      {
        accessorKey: 'preco',
        header: 'Preço unit.',
        cell: ({ row }) => <span className="tabular-nums">{formatBRL(row.original.preco)}</span>,
      },
      {
        accessorKey: 'data',
        header: 'Data',
        cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.data)}</span>,
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={HISTORICO}
      searchPlaceholder="Buscar item, fornecedor..."
      emptyMessage="Sem histórico de preços."
    />
  )
}
