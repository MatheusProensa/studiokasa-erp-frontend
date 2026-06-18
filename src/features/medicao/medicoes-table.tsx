import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { NameAvatar } from '@/components/ui/name-avatar'
import { DataTable } from '@/components/data-table/data-table'
import { formatDateTime } from '@/lib/format'
import { STATUS_META } from './constants'
import { useMedicoes } from './medicoes-context'
import { MedicaoDetailSheet } from './medicao-detail-sheet'
import { AgendarFormDialog } from './agendar-form-dialog'
import type { Medicao } from './types'

export function MedicoesTable() {
  const { medicoes } = useMedicoes()
  const [detail, setDetail] = useState<Medicao | null>(null)
  const [agendar, setAgendar] = useState(false)

  const columns = useMemo<ColumnDef<Medicao>[]>(
    () => [
      {
        accessorKey: 'codigo',
        header: 'Código',
        cell: ({ row }) => <Badge variant="outline">{row.original.codigo}</Badge>,
      },
      {
        accessorKey: 'ambiente',
        header: 'Medição',
        cell: ({ row }) => (
          <div className="flex flex-col leading-tight">
            <span className="font-medium">{row.original.ambiente}</span>
            <span className="text-xs text-muted-foreground">
              {row.original.cliente} · {row.original.projeto}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'tipo',
        header: 'Tipo',
        cell: ({ row }) => (
          <Badge variant={row.original.tipo === 'final' ? 'default' : 'secondary'}>
            {row.original.tipo === 'final' ? 'Final' : 'Preliminar'}
          </Badge>
        ),
      },
      {
        accessorKey: 'conferente',
        header: 'Conferente',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <NameAvatar name={row.original.conferente} size="sm" />
            {row.original.conferente}
          </div>
        ),
      },
      {
        accessorKey: 'agendaInicio',
        header: 'Agenda',
        cell: ({ row }) => (
          <span className="text-muted-foreground">{formatDateTime(row.original.agendaInicio)}</span>
        ),
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
        data={medicoes}
        searchPlaceholder="Buscar medição, cliente..."
        emptyMessage="Nenhuma medição agendada."
        toolbar={
          <Button onClick={() => setAgendar(true)}>
            <Plus className="size-4" />
            Agendar medição
          </Button>
        }
      />

      <MedicaoDetailSheet medicao={detail} onOpenChange={(o) => !o && setDetail(null)} />
      <AgendarFormDialog open={agendar} onOpenChange={setAgendar} />
    </>
  )
}
