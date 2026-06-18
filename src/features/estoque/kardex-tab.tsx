import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { DataTable } from '@/components/data-table/data-table'
import { formatDateTime } from '@/lib/format'
import { MOV_META, type MovTipo } from './constants'
import { useEstoque } from './estoque-context'
import type { Movimento } from './types'

const ICON: Record<MovTipo, typeof ArrowDownToLine> = {
  entrada: ArrowDownToLine,
  saida: ArrowUpFromLine,
  transferencia: ArrowLeftRight,
}

export function KardexTab() {
  const { movimentos } = useEstoque()

  const columns = useMemo<ColumnDef<Movimento>[]>(
    () => [
      {
        accessorKey: 'data',
        header: 'Data',
        cell: ({ row }) => <span className="text-muted-foreground">{formatDateTime(row.original.data)}</span>,
      },
      {
        accessorKey: 'tipo',
        header: 'Tipo',
        cell: ({ row }) => {
          const m = MOV_META[row.original.tipo]
          const Icon = ICON[row.original.tipo]
          return (
            <StatusBadge tone={m.tone}>
              <Icon className="size-3" />
              {m.label}
            </StatusBadge>
          )
        },
      },
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
        accessorKey: 'qtd',
        header: 'Qtd',
        cell: ({ row }) => {
          const sinal = row.original.tipo === 'saida' ? '−' : row.original.tipo === 'entrada' ? '+' : ''
          return <span className="tabular-nums font-medium">{sinal}{row.original.qtd}</span>
        },
      },
      {
        accessorKey: 'ref',
        header: 'Referência',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.ref}</span>,
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={movimentos}
      searchPlaceholder="Buscar movimentação..."
      emptyMessage="Nenhuma movimentação."
    />
  )
}
