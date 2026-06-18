import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { NameAvatar } from '@/components/ui/name-avatar'
import { DataTable } from '@/components/data-table/data-table'
import { formatBRL } from '@/lib/format'
import { COMISSAO_STATUS_META } from './constants'
import { useFinanceiro } from './financeiro-context'
import type { Comissao } from './types'

export function ComissoesTab() {
  const { comissoes, avancarComissao } = useFinanceiro()

  const columns = useMemo<ColumnDef<Comissao>[]>(
    () => [
      {
        accessorKey: 'beneficiario',
        header: 'Beneficiário',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <NameAvatar name={row.original.beneficiario} size="sm" />
            <span className="font-medium">{row.original.beneficiario}</span>
          </div>
        ),
      },
      {
        accessorKey: 'papel',
        header: 'Papel',
        cell: ({ row }) => <Badge variant="secondary">{row.original.papel}</Badge>,
      },
      {
        accessorKey: 'referencia',
        header: 'Referência',
        cell: ({ row }) => <Badge variant="outline">{row.original.referencia}</Badge>,
      },
      {
        accessorKey: 'valor',
        header: 'Valor',
        cell: ({ row }) => <span className="tabular-nums font-medium">{formatBRL(row.original.valor)}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const s = COMISSAO_STATUS_META[row.original.status]
          return <StatusBadge tone={s.tone}>{s.label}</StatusBadge>
        },
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) =>
          row.original.status !== 'paga' ? (
            <div className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  avancarComissao(row.original.id)
                  toast.success(
                    row.original.status === 'pendente' ? 'Comissão liberada.' : 'Comissão paga.',
                  )
                }}
              >
                <ArrowRight className="size-4" />
                {row.original.status === 'pendente' ? 'Liberar' : 'Pagar'}
              </Button>
            </div>
          ) : null,
      },
    ],
    [avancarComissao],
  )

  return (
    <DataTable
      columns={columns}
      data={comissoes}
      searchPlaceholder="Buscar beneficiário..."
      emptyMessage="Nenhuma comissão."
    />
  )
}
