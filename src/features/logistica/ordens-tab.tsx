import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { NameAvatar } from '@/components/ui/name-avatar'
import { DataTable } from '@/components/data-table/data-table'
import { formatDateTime } from '@/lib/format'
import { OS_STATUS_META } from './constants'
import { useLogistica } from './logistica-context'
import { OsDetailSheet } from './os-detail-sheet'
import type { OrdemServico } from './types'

export function OrdensTab() {
  const { ordens } = useLogistica()
  const [detail, setDetail] = useState<OrdemServico | null>(null)

  const columns = useMemo<ColumnDef<OrdemServico>[]>(
    () => [
      {
        accessorKey: 'codigo',
        header: 'OS',
        cell: ({ row }) => <Badge variant="outline">{row.original.codigo}</Badge>,
      },
      {
        accessorKey: 'ambiente',
        header: 'Serviço',
        cell: ({ row }) => (
          <div className="flex flex-col leading-tight">
            <span className="font-medium">{row.original.ambiente}</span>
            <span className="text-xs text-muted-foreground">{row.original.cliente}</span>
          </div>
        ),
      },
      {
        accessorKey: 'equipe',
        header: 'Equipe',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <NameAvatar name={row.original.equipe} size="sm" />
            {row.original.equipe}
          </div>
        ),
      },
      {
        accessorKey: 'agenda',
        header: 'Agenda',
        cell: ({ row }) => <span className="text-muted-foreground">{formatDateTime(row.original.agenda)}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const s = OS_STATUS_META[row.original.status]
          return (
            <div className="flex items-center gap-1.5">
              <StatusBadge tone={s.tone}>{s.label}</StatusBadge>
              {row.original.avarias.length > 0 && (
                <span className="text-[var(--status-danger)]" title="Com avarias">
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
        data={ordens}
        searchPlaceholder="Buscar OS, cliente, equipe..."
        emptyMessage="Nenhuma ordem de serviço."
      />
      <OsDetailSheet os={detail} onOpenChange={(o) => !o && setDetail(null)} />
    </>
  )
}
