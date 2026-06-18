import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { DataTable } from '@/components/data-table/data-table'
import { SCORE_META } from '@/features/crm/constants'
import { LEAD_STATUS_META } from './constants'
import { LEADS_MKT } from './mock-data'
import type { LeadMkt } from './types'

export function LeadsTab() {
  const [leads, setLeads] = useState<LeadMkt[]>(LEADS_MKT)

  function enviarCrm(id: number) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'enviado' } : l)))
    toast.success('Lead enviado ao CRM (sem duplicar cadastro).')
  }

  const columns = useMemo<ColumnDef<LeadMkt>[]>(
    () => [
      { accessorKey: 'nome', header: 'Lead', cell: ({ row }) => <span className="font-medium">{row.original.nome}</span> },
      { accessorKey: 'origem', header: 'Origem', cell: ({ row }) => <Badge variant="secondary">{row.original.origem}</Badge> },
      {
        accessorKey: 'score',
        header: 'Score',
        cell: ({ row }) => {
          const s = SCORE_META[row.original.score]
          return <StatusBadge tone={s.tone}>{s.label}</StatusBadge>
        },
      },
      {
        accessorKey: 'consentimento',
        header: 'LGPD',
        cell: ({ row }) =>
          row.original.consentimento ? (
            <StatusBadge tone="success">Opt-in</StatusBadge>
          ) : (
            <StatusBadge tone="danger">Sem consentimento</StatusBadge>
          ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const s = LEAD_STATUS_META[row.original.status]
          return <StatusBadge tone={s.tone}>{s.label}</StatusBadge>
        },
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) =>
          row.original.status !== 'enviado' ? (
            <div className="text-right">
              <Button
                variant="outline"
                size="sm"
                disabled={!row.original.consentimento}
                title={!row.original.consentimento ? 'Sem opt-in LGPD' : undefined}
                onClick={() => enviarCrm(row.original.id)}
              >
                <Send className="size-4" /> Enviar ao CRM
              </Button>
            </div>
          ) : null,
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={leads}
      searchPlaceholder="Buscar lead, origem..."
      emptyMessage="Nenhum lead captado."
    />
  )
}
