import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { NameAvatar } from '@/components/ui/name-avatar'
import { DataTable } from '@/components/data-table/data-table'
import { formatDate } from '@/lib/format'
import { CHAMADO_STATUS_META, PRIORIDADE_META } from './constants'
import { usePosvenda } from './posvenda-context'
import { ChamadoDetailSheet } from './chamado-detail-sheet'
import type { Chamado } from './types'

export function ChamadosTab() {
  const { chamados } = usePosvenda()
  const [detail, setDetail] = useState<Chamado | null>(null)

  const columns = useMemo<ColumnDef<Chamado>[]>(
    () => [
      { accessorKey: 'codigo', header: 'Chamado', cell: ({ row }) => <Badge variant="outline">{row.original.codigo}</Badge> },
      {
        accessorKey: 'assunto',
        header: 'Assunto',
        cell: ({ row }) => (
          <div className="flex flex-col leading-tight">
            <span className="font-medium">{row.original.assunto}</span>
            <span className="text-xs text-muted-foreground">{row.original.cliente} · {row.original.projeto}</span>
          </div>
        ),
      },
      {
        accessorKey: 'prioridade',
        header: 'Prioridade',
        cell: ({ row }) => {
          const p = PRIORIDADE_META[row.original.prioridade]
          return <StatusBadge tone={p.tone}>{p.label}</StatusBadge>
        },
      },
      {
        accessorKey: 'tecnico',
        header: 'Técnico',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <NameAvatar name={row.original.tecnico} size="sm" />
            {row.original.tecnico}
          </div>
        ),
      },
      {
        accessorKey: 'abertoEm',
        header: 'Aberto em',
        cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.abertoEm)}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const s = CHAMADO_STATUS_META[row.original.status]
          return <StatusBadge tone={s.tone}>{s.label}</StatusBadge>
        },
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="text-right">
            <Button variant="outline" size="sm" onClick={() => setDetail(row.original)}>Abrir</Button>
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
        data={chamados}
        searchPlaceholder="Buscar chamado, cliente..."
        emptyMessage="Nenhum chamado."
      />
      <ChamadoDetailSheet chamado={detail} onOpenChange={(o) => !o && setDetail(null)} />
    </>
  )
}
