import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowLeftRight, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table/data-table'
import { formatDateTime } from '@/lib/format'
import { useEstoque } from './estoque-context'
import { MovimentoDialog } from './movimento-dialog'
import type { Movimento } from './types'

export function TransferenciasTab() {
  const { movimentos } = useEstoque()
  const [open, setOpen] = useState(false)
  const transferencias = useMemo(() => movimentos.filter((m) => m.tipo === 'transferencia'), [movimentos])

  const columns = useMemo<ColumnDef<Movimento>[]>(() => [
    { accessorKey: 'item', header: 'Item', cell: ({ row }) => <span className="font-medium">{row.original.item}</span> },
    { accessorKey: 'sku', header: 'SKU', cell: ({ row }) => <Badge variant="outline">{row.original.sku}</Badge> },
    { accessorKey: 'qtd', header: 'Qtd', cell: ({ row }) => <span className="tabular-nums">{row.original.qtd}</span> },
    { accessorKey: 'ref', header: 'Rota', cell: ({ row }) => <span className="text-muted-foreground">{row.original.ref}</span> },
    { accessorKey: 'responsavel', header: 'Responsável' },
    { accessorKey: 'data', header: 'Data', cell: ({ row }) => <span className="text-muted-foreground">{formatDateTime(row.original.data)}</span> },
  ], [])

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Nova transferência
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={transferencias}
        searchPlaceholder="Buscar transferência..."
        emptyMessage="Nenhuma transferência registrada."
      />
      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ArrowLeftRight className="size-3.5" /> Transferências entre filiais — informe a rota no campo "Referência" (ex: Matriz → CD Logística)
      </p>
      <MovimentoDialog open={open} onOpenChange={setOpen} tipoInicial="transferencia" />
    </div>
  )
}
