import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { DataTable } from '@/components/data-table/data-table'
import { CATEGORIA_LABEL, ITEM_STATUS_META } from './constants'
import { useEstoque } from './estoque-context'
import { MovimentoDialog } from './movimento-dialog'
import type { EstoqueItem } from './types'

export function ItensTab() {
  const { itens } = useEstoque()
  const [mov, setMov] = useState(false)

  const columns = useMemo<ColumnDef<EstoqueItem>[]>(
    () => [
      {
        accessorKey: 'sku',
        header: 'SKU',
        cell: ({ row }) => <Badge variant="outline">{row.original.sku}</Badge>,
      },
      {
        accessorKey: 'nome',
        header: 'Item',
        cell: ({ row }) => (
          <div className="flex flex-col leading-tight">
            <span className="font-medium">{row.original.nome}</span>
            <span className="text-xs text-muted-foreground">
              {CATEGORIA_LABEL[row.original.categoria]}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'saldo',
        header: 'Saldo',
        cell: ({ row }) => {
          const baixo = row.original.minimo > 0 && row.original.saldo < row.original.minimo
          return (
            <div className="flex items-center gap-2">
              <span className={`tabular-nums font-medium ${baixo ? 'text-[var(--status-danger)]' : ''}`}>
                {row.original.saldo}
              </span>
              {baixo && <StatusBadge tone="danger">Abaixo do mínimo</StatusBadge>}
            </div>
          )
        },
      },
      {
        accessorKey: 'endereco',
        header: 'Endereço',
        cell: ({ row }) => (
          <span className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="size-3.5" />
            {row.original.endereco}
          </span>
        ),
      },
      {
        accessorKey: 'lote',
        header: 'Lote',
        cell: ({ row }) => <span className="tabular-nums text-muted-foreground">{row.original.lote}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const s = ITEM_STATUS_META[row.original.status]
          return <StatusBadge tone={s.tone}>{s.label}</StatusBadge>
        },
      },
    ],
    [],
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={itens}
        searchPlaceholder="Buscar item, SKU, endereço..."
        emptyMessage="Nenhum item em estoque."
        toolbar={
          <Button onClick={() => setMov(true)}>
            <Plus className="size-4" />
            Movimentação
          </Button>
        }
      />
      <MovimentoDialog open={mov} onOpenChange={setMov} />
    </>
  )
}
