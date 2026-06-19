import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, SlidersHorizontal, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { NameAvatar } from '@/components/ui/name-avatar'
import { DataTable } from '@/components/data-table/data-table'
import { formatDateTime } from '@/lib/format'
import { MOV_META, type MovTipo } from './constants'
import { useEstoque } from './estoque-context'
import type { Movimento } from './types'

const ICON: Record<MovTipo, typeof ArrowDownToLine> = {
  entrada: ArrowDownToLine,
  saida: ArrowUpFromLine,
  transferencia: ArrowLeftRight,
  ajuste: SlidersHorizontal,
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
        id: 'saldo',
        header: 'Saldo',
        cell: ({ row }) => (
          <span className="flex items-center gap-1 whitespace-nowrap tabular-nums text-muted-foreground">
            {row.original.saldoAntes}
            <ArrowRight className="size-3" />
            <span className="font-medium text-foreground">{row.original.saldoDepois}</span>
          </span>
        ),
      },
      {
        accessorKey: 'responsavel',
        header: 'Responsável',
        cell: ({ row }) => (
          <span className="flex items-center gap-2 whitespace-nowrap">
            <NameAvatar name={row.original.responsavel} size="sm" />
            {row.original.responsavel}
          </span>
        ),
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
