import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, MapPin, TrendingDown, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { DataTable } from '@/components/data-table/data-table'
import { CATEGORIA_LABEL, ITEM_STATUS_META } from './constants'
import { useEstoque } from './estoque-context'
import { MovimentoDialog } from './movimento-dialog'
import type { EstoqueItem } from './types'

type Nivel = 'critico' | 'atencao' | 'ok' | 'na'

/** Semáforo de saldo: abaixo do mínimo = crítico; até 30% acima = atenção. */
function nivelSaldo(saldo: number, minimo: number): Nivel {
  if (minimo <= 0) return 'na'
  if (saldo < minimo) return 'critico'
  if (saldo <= minimo * 1.3) return 'atencao'
  return 'ok'
}

const NIVEL_COR: Record<Nivel, string | null> = {
  critico: 'var(--status-danger)',
  atencao: 'var(--status-warning)',
  ok: 'var(--status-success)',
  na: null,
}

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
          const { saldo, minimo } = row.original
          const nivel = nivelSaldo(saldo, minimo)
          const cor = NIVEL_COR[nivel]
          return (
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="tabular-nums font-medium" style={cor ? { color: cor } : undefined}>
                {saldo}
              </span>
              {minimo > 0 && (
                <span className="text-xs text-muted-foreground">/ mín {minimo}</span>
              )}
              {nivel === 'critico' && (
                <span style={{ color: cor ?? undefined }} title="Abaixo do mínimo">
                  <TrendingDown className="size-3.5" />
                </span>
              )}
              {nivel === 'atencao' && (
                <span style={{ color: cor ?? undefined }} title="Perto do mínimo">
                  <AlertTriangle className="size-3.5" />
                </span>
              )}
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
