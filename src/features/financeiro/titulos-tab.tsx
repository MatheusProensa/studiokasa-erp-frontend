import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { DataTable } from '@/components/data-table/data-table'
import { formatBRL, formatDate } from '@/lib/format'
import { TITULO_STATUS_META, type TituloTipo } from './constants'
import { useFinanceiro } from './financeiro-context'
import type { Titulo } from './types'

/** Status efetivo: aberto + vencimento passado = vencido. */
function statusEfetivo(t: Titulo): Titulo['status'] {
  if (t.status === 'pago') return 'pago'
  return new Date(t.vencimento) < new Date(new Date().toDateString()) ? 'vencido' : 'aberto'
}

export function TitulosTab({ tipo }: { tipo: TituloTipo }) {
  const { titulos, quitar } = useFinanceiro()
  const data = useMemo(() => titulos.filter((t) => t.tipo === tipo), [titulos, tipo])

  const columns = useMemo<ColumnDef<Titulo>[]>(
    () => [
      {
        accessorKey: 'descricao',
        header: 'Descrição',
        cell: ({ row }) => (
          <div className="flex flex-col leading-tight">
            <span className="font-medium">{row.original.descricao}</span>
            <span className="text-xs text-muted-foreground">{row.original.contraparte}</span>
          </div>
        ),
      },
      {
        accessorKey: 'categoria',
        header: tipo === 'pagar' ? 'Categoria' : 'Forma',
        cell: ({ row }) => <Badge variant="secondary">{row.original.categoria}</Badge>,
      },
      {
        accessorKey: 'vencimento',
        header: 'Vencimento',
        cell: ({ row }) => {
          const venc = statusEfetivo(row.original) === 'vencido'
          return (
            <span className={venc ? 'font-medium text-[var(--status-danger)]' : 'text-muted-foreground'}>
              {formatDate(row.original.vencimento)}
            </span>
          )
        },
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
          const s = TITULO_STATUS_META[statusEfetivo(row.original)]
          return <StatusBadge tone={s.tone}>{s.label}</StatusBadge>
        },
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) =>
          row.original.status !== 'pago' ? (
            <div className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  quitar(row.original.id)
                  toast.success(tipo === 'pagar' ? 'Pagamento registrado.' : 'Recebimento baixado.')
                }}
              >
                <Check className="size-4" />
                {tipo === 'pagar' ? 'Pagar' : 'Baixar'}
              </Button>
            </div>
          ) : null,
      },
    ],
    [tipo, quitar],
  )

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Buscar título, contraparte..."
      emptyMessage="Nenhum título."
    />
  )
}
