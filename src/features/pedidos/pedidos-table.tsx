import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { DataTable } from '@/components/data-table/data-table'
import { formatBRL, formatDate } from '@/lib/format'
import { STATUS_META } from './constants'
import { estaAtrasado, usePedidos } from './pedidos-context'
import { PedidoDetailSheet } from './pedido-detail-sheet'
import { NovoPedidoDialog } from './novo-pedido-dialog'
import type { Pedido } from './types'

export function PedidosTable() {
  const { pedidos } = usePedidos()
  const [detail, setDetail] = useState<Pedido | null>(null)
  const [novo, setNovo] = useState(false)

  const columns = useMemo<ColumnDef<Pedido>[]>(
    () => [
      {
        accessorKey: 'codigo',
        header: 'Pedido',
        cell: ({ row }) => <Badge variant="outline">{row.original.codigo}</Badge>,
      },
      {
        accessorKey: 'ambiente',
        header: 'Projeto',
        cell: ({ row }) => (
          <div className="flex flex-col leading-tight">
            <span className="font-medium">{row.original.ambiente}</span>
            <span className="text-xs text-muted-foreground">{row.original.projeto}</span>
          </div>
        ),
      },
      { accessorKey: 'fornecedor', header: 'Fornecedor' },
      {
        accessorKey: 'prazoEntrega',
        header: 'Prazo',
        cell: ({ row }) => {
          const atrasado = estaAtrasado(row.original)
          return (
            <span className={atrasado ? 'font-medium text-[var(--status-danger)]' : 'text-muted-foreground'}>
              {formatDate(row.original.prazoEntrega)}
            </span>
          )
        },
      },
      {
        accessorKey: 'valor',
        header: 'Valor',
        cell: ({ row }) => <span className="tabular-nums">{formatBRL(row.original.valor)}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const s = STATUS_META[row.original.status]
          const atrasado = estaAtrasado(row.original)
          return (
            <div className="flex items-center gap-1.5">
              <StatusBadge tone={s.tone}>{s.label}</StatusBadge>
              {atrasado && <StatusBadge tone="danger">Atrasado</StatusBadge>}
              {row.original.divergencias.length > 0 && (
                <span className="text-[var(--status-danger)]" title="Com divergências">
                  <AlertTriangle className="size-4" />
                </span>
              )}
            </div>
          )
        },
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="text-right">
            <Button variant="outline" size="sm" onClick={() => setDetail(row.original)}>
              Abrir
            </Button>
          </div>
        ),
      },
    ],
    [],
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={pedidos}
        searchPlaceholder="Buscar pedido, fornecedor..."
        emptyMessage="Nenhum pedido ao fornecedor."
      />

      <PedidoDetailSheet pedido={detail} onOpenChange={(o) => !o && setDetail(null)} />
      <NovoPedidoDialog open={novo} onOpenChange={setNovo} />
    </>
  )
}
