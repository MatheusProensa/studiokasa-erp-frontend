import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Check } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { DataTable } from '@/components/data-table/data-table'
import { formatBRL, formatDate } from '@/lib/format'
import { useFiscal } from './fiscal-context'
import type { NotaEntrada } from './types'

export function EntradasTab() {
  const { entradas, escriturar } = useFiscal()

  const columns = useMemo<ColumnDef<NotaEntrada>[]>(
    () => [
      {
        accessorKey: 'numero',
        header: 'NF-e',
        cell: ({ row }) => <Badge variant="outline">{row.original.numero}</Badge>,
      },
      {
        accessorKey: 'fornecedor',
        header: 'Fornecedor',
        cell: ({ row }) => <span className="font-medium">{row.original.fornecedor}</span>,
      },
      {
        accessorKey: 'valor',
        header: 'Valor',
        cell: ({ row }) => <span className="tabular-nums">{formatBRL(row.original.valor)}</span>,
      },
      {
        accessorKey: 'credito',
        header: 'Crédito tributário',
        cell: ({ row }) => (
          <span className="tabular-nums text-[var(--status-success)]">
            {formatBRL(row.original.credito)}
          </span>
        ),
      },
      {
        accessorKey: 'emitidaEm',
        header: 'Emissão',
        cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.emitidaEm)}</span>,
      },
      {
        accessorKey: 'escriturada',
        header: 'Escrituração',
        cell: ({ row }) =>
          row.original.escriturada ? (
            <StatusBadge tone="success">Escriturada</StatusBadge>
          ) : (
            <StatusBadge tone="warning">Pendente</StatusBadge>
          ),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) =>
          !row.original.escriturada ? (
            <div className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  escriturar(row.original.id)
                  toast.success('Entrada escriturada (crédito apropriado).')
                }}
              >
                <Check className="size-4" /> Escriturar
              </Button>
            </div>
          ) : null,
      },
    ],
    [escriturar],
  )

  return (
    <DataTable
      columns={columns}
      data={entradas}
      searchPlaceholder="Buscar NF-e, fornecedor..."
      emptyMessage="Nenhuma nota de entrada."
    />
  )
}
