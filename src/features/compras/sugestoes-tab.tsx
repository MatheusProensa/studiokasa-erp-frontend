import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { DataTable } from '@/components/data-table/data-table'
import { formatBRL } from '@/lib/format'
import { SUGESTOES } from './mock-data'
import type { Cotacao, SugestaoCompra } from './types'

export function SugestoesTab({ onCotacaoGerada }: { onCotacaoGerada: (c: Cotacao) => void }) {
  const columns = useMemo<ColumnDef<SugestaoCompra>[]>(
    () => [
      {
        accessorKey: 'item',
        header: 'Item',
        cell: ({ row }) => <span className="font-medium">{row.original.item}</span>,
      },
      {
        accessorKey: 'estoqueAtual',
        header: 'Estoque',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="tabular-nums">{row.original.estoqueAtual}</span>
            <StatusBadge tone="danger">Abaixo do mínimo</StatusBadge>
          </div>
        ),
      },
      {
        accessorKey: 'minimo',
        header: 'Mínimo',
        cell: ({ row }) => <span className="tabular-nums text-muted-foreground">{row.original.minimo}</span>,
      },
      {
        accessorKey: 'sugestao',
        header: 'Sugestão',
        cell: ({ row }) => <Badge variant="secondary">{row.original.sugestao} un.</Badge>,
      },
      { accessorKey: 'melhorFornecedor', header: 'Melhor fornecedor' },
      {
        id: 'estimado',
        header: 'Estimado',
        cell: ({ row }) => (
          <span className="tabular-nums">{formatBRL(row.original.sugestao * row.original.precoUnit)}</span>
        ),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="text-right">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const s = row.original
                onCotacaoGerada({
                  id: Date.now(),
                  codigo: `COT-${3000 + Math.floor(Math.random() * 900)}`,
                  descricao: s.item,
                  status: 'aberta',
                  criadaEm: new Date().toISOString(),
                  itens: [s.item],
                  propostas: [{ fornecedor: s.melhorFornecedor, valorTotal: s.sugestao * s.precoUnit, prazoDias: 5 }],
                })
                toast.success(`Cotação gerada para "${s.item}" — confira na aba Cotações.`)
              }}
            >
              <ShoppingCart className="size-4" /> Gerar cotação
            </Button>
          </div>
        ),
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={SUGESTOES}
      searchPlaceholder="Buscar item..."
      emptyMessage="Nenhuma sugestão de compra."
    />
  )
}
