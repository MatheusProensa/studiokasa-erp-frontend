import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/data-table/data-table'
import { useEstoque } from './estoque-context'

interface LoteLinha {
  lote: string
  itens: number
  saldoTotal: number
  filial: string
}

export function LotesTab() {
  const { itens } = useEstoque()

  const lotes = useMemo<LoteLinha[]>(() => {
    const map = new Map<string, LoteLinha>()
    for (const i of itens) {
      const atual = map.get(i.lote)
      if (atual) {
        atual.itens += 1
        atual.saldoTotal += i.saldo
      } else {
        map.set(i.lote, { lote: i.lote, itens: 1, saldoTotal: i.saldo, filial: i.filial })
      }
    }
    return Array.from(map.values())
  }, [itens])

  const columns = useMemo<ColumnDef<LoteLinha>[]>(() => [
    { accessorKey: 'lote', header: 'Lote', cell: ({ row }) => <Badge variant="outline">{row.original.lote}</Badge> },
    { accessorKey: 'itens', header: 'SKUs no lote', cell: ({ row }) => <span className="tabular-nums">{row.original.itens}</span> },
    { accessorKey: 'saldoTotal', header: 'Saldo total', cell: ({ row }) => <span className="tabular-nums font-medium">{row.original.saldoTotal} un.</span> },
    { accessorKey: 'filial', header: 'Filial', cell: ({ row }) => <span className="text-muted-foreground">{row.original.filial}</span> },
  ], [])

  return (
    <DataTable
      columns={columns}
      data={lotes}
      searchPlaceholder="Buscar lote..."
      emptyMessage="Nenhum lote encontrado."
    />
  )
}
