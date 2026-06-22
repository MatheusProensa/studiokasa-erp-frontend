import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { NameAvatar } from '@/components/ui/name-avatar'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table/data-table'
import { formatDate } from '@/lib/format'
import { COLABORADORES, type Colaborador } from './mock-data'
import { ColaboradorFormDialog } from './colaborador-form-dialog'

export function ColaboradoresTab() {
  const [selecionado, setSelecionado] = useState<Colaborador | null>(null)
  const [open, setOpen] = useState(false)
  const [, setTick] = useState(0)

  const columns = useMemo<ColumnDef<Colaborador>[]>(
    () => [
      {
        accessorKey: 'nome',
        header: 'Colaborador',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <NameAvatar name={row.original.nome} size="md" />
            <div className="flex flex-col leading-tight">
              <span className="font-medium">{row.original.nome}</span>
              <span className="text-xs text-muted-foreground">{row.original.cargo}</span>
            </div>
          </div>
        ),
      },
      { accessorKey: 'unidade', header: 'Unidade', cell: ({ row }) => <Badge variant="secondary">{row.original.unidade}</Badge> },
      {
        accessorKey: 'admissao',
        header: 'Admissão',
        cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.admissao)}</span>,
      },
      {
        accessorKey: 'cpf',
        header: 'CPF',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.cpf ?? '—'}</span>,
      },
      {
        accessorKey: 'ativo',
        header: 'Status',
        cell: ({ row }) =>
          row.original.ativo ? (
            <StatusBadge tone="success">Ativo</StatusBadge>
          ) : (
            <StatusBadge tone="neutral">Inativo</StatusBadge>
          ),
      },
      {
        id: 'acoes',
        header: '',
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="outline"
            onClick={() => { setSelecionado(row.original); setOpen(true) }}
          >
            Editar
          </Button>
        ),
      },
    ],
    [],
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={COLABORADORES}
        searchPlaceholder="Buscar colaborador, cargo..."
        emptyMessage="Nenhum colaborador."
      />
      <ColaboradorFormDialog
        open={open}
        onOpenChange={setOpen}
        colaborador={selecionado}
        onSaved={() => setTick((t) => t + 1)}
      />
    </>
  )
}
