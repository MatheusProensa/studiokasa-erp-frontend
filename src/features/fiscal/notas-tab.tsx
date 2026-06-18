import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { DataTable } from '@/components/data-table/data-table'
import { formatBRL, formatDate } from '@/lib/format'
import { STATUS_META } from './constants'
import { useFiscal } from './fiscal-context'
import { NotaDetailSheet } from './nota-detail-sheet'
import type { NotaFiscal } from './types'

export function NotasTab() {
  const { notas } = useFiscal()
  const [detail, setDetail] = useState<NotaFiscal | null>(null)

  const columns = useMemo<ColumnDef<NotaFiscal>[]>(
    () => [
      {
        accessorKey: 'numero',
        header: 'Número',
        cell: ({ row }) => <Badge variant="outline">{row.original.numero}</Badge>,
      },
      {
        accessorKey: 'modelo',
        header: 'Modelo',
        cell: ({ row }) => <Badge variant="secondary">{row.original.modelo}</Badge>,
      },
      {
        accessorKey: 'cliente',
        header: 'Destinatário',
        cell: ({ row }) => (
          <div className="flex flex-col leading-tight">
            <span className="font-medium">{row.original.cliente}</span>
            <span className="text-xs text-muted-foreground">{row.original.ambiente}</span>
          </div>
        ),
      },
      {
        accessorKey: 'valor',
        header: 'Valor',
        cell: ({ row }) => <span className="tabular-nums">{formatBRL(row.original.valor)}</span>,
      },
      {
        accessorKey: 'emitidaEm',
        header: 'Emissão',
        cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.emitidaEm)}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const s = STATUS_META[row.original.status]
          return <StatusBadge tone={s.tone}>{s.label}</StatusBadge>
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
        data={notas}
        searchPlaceholder="Buscar nota, destinatário..."
        emptyMessage="Nenhuma nota emitida."
      />
      <NotaDetailSheet nota={detail} onOpenChange={(o) => !o && setDetail(null)} />
    </>
  )
}
