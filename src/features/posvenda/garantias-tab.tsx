import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { DataTable } from '@/components/data-table/data-table'
import { formatDate } from '@/lib/format'
import { GARANTIAS } from './mock-data'
import type { Garantia } from './types'

function diasRestantes(fim: string) {
  return Math.ceil((new Date(fim).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

export function GarantiasTab() {
  const columns = useMemo<ColumnDef<Garantia>[]>(
    () => [
      { accessorKey: 'projeto', header: 'Projeto', cell: ({ row }) => <Badge variant="outline">{row.original.projeto}</Badge> },
      {
        accessorKey: 'cliente',
        header: 'Cliente',
        cell: ({ row }) => (
          <div className="flex flex-col leading-tight">
            <span className="font-medium">{row.original.cliente}</span>
            <span className="text-xs text-muted-foreground">{row.original.ambiente}</span>
          </div>
        ),
      },
      { accessorKey: 'inicio', header: 'Início', cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.inicio)}</span> },
      { accessorKey: 'fim', header: 'Vencimento', cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.fim)}</span> },
      {
        id: 'situacao',
        header: 'Situação',
        cell: ({ row }) => {
          const d = diasRestantes(row.original.fim)
          if (d < 0) return <StatusBadge tone="neutral">Expirada</StatusBadge>
          if (d <= 60) return <StatusBadge tone="warning">Vence em {d} dias</StatusBadge>
          return <StatusBadge tone="success">Vigente</StatusBadge>
        },
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={GARANTIAS}
      searchPlaceholder="Buscar projeto, cliente..."
      emptyMessage="Nenhuma garantia."
    />
  )
}
