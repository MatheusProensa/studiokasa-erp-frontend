import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Send, Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { DataTable } from '@/components/data-table/data-table'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { SCORE_META, ORIGENS, type Origem } from '@/features/crm/constants'
import { CLIENTES } from '@/features/crm/mock-data'
import { LEAD_STATUS_META } from './constants'
import { LEADS_MKT, CAMPANHAS } from './mock-data'
import { NovoLeadDialog } from './novo-lead-dialog'
import type { LeadMkt } from './types'

function nomeCampanha(campanhaId: number | null) {
  if (campanhaId == null) return null
  return CAMPANHAS.find((c) => c.id === campanhaId)?.nome ?? null
}

function origemValida(origem: string): Origem {
  return (ORIGENS as readonly string[]).includes(origem) ? (origem as Origem) : 'Indicação'
}

export function LeadsTab() {
  const [leads, setLeads] = useState<LeadMkt[]>(LEADS_MKT)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<LeadMkt | null>(null)
  const [deleting, setDeleting] = useState<LeadMkt | null>(null)

  function handleNew() {
    setEditing(null)
    setFormOpen(true)
  }

  function handleEdit(lead: LeadMkt) {
    setEditing(lead)
    setFormOpen(true)
  }

  function handleSaved(lead: LeadMkt) {
    setLeads((prev) => {
      const idx = prev.findIndex((l) => l.id === lead.id)
      if (idx >= 0) {
        const next = prev.map((l) => (l.id === lead.id ? lead : l))
        const mockIdx = LEADS_MKT.findIndex((l) => l.id === lead.id)
        if (mockIdx >= 0) LEADS_MKT[mockIdx] = lead
        return next
      }
      LEADS_MKT.push(lead)
      return [lead, ...prev]
    })
  }

  function confirmarExclusao() {
    if (!deleting) return
    setLeads((prev) => prev.filter((l) => l.id !== deleting.id))
    const idx = LEADS_MKT.findIndex((l) => l.id === deleting.id)
    if (idx >= 0) LEADS_MKT.splice(idx, 1)
    toast.success(`Lead "${deleting.nome}" excluído.`)
    setDeleting(null)
  }

  function enviarCrm(id: number) {
    const lead = leads.find((l) => l.id === id)
    if (!lead) return
    const jaExiste = CLIENTES.some((c) => c.nome.toLowerCase() === lead.nome.toLowerCase())
    if (!jaExiste) {
      CLIENTES.push({
        id: Math.max(0, ...CLIENTES.map((c) => c.id)) + 1,
        nome: lead.nome,
        tipo: 'PF',
        documento: '—',
        telefone: '—',
        email: '—',
        cidade: '—',
        origem: origemValida(lead.origem),
      })
    }
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'enviado' } : l)))
    const mockIdx = LEADS_MKT.findIndex((l) => l.id === id)
    if (mockIdx >= 0) LEADS_MKT[mockIdx] = { ...LEADS_MKT[mockIdx], status: 'enviado' }
    toast.success(jaExiste ? 'Lead já existia no CRM — status atualizado.' : `${lead.nome} cadastrado(a) no CRM com sucesso.`)
  }

  const columns = useMemo<ColumnDef<LeadMkt>[]>(
    () => [
      { accessorKey: 'nome', header: 'Lead', cell: ({ row }) => <span className="font-medium">{row.original.nome}</span> },
      { accessorKey: 'telefone', header: 'Telefone', cell: ({ row }) => <span className="text-muted-foreground">{row.original.telefone ?? '—'}</span> },
      { accessorKey: 'origem', header: 'Origem', cell: ({ row }) => <Badge variant="secondary">{row.original.origem}</Badge> },
      {
        id: 'campanha',
        header: 'Campanha',
        cell: ({ row }) => {
          const nome = nomeCampanha(row.original.campanhaId)
          return nome ? <span className="text-sm">{nome}</span> : <span className="text-xs text-muted-foreground">Orgânico</span>
        },
      },
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
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            {row.original.status !== 'enviado' && (
              <Button
                variant="outline"
                size="sm"
                disabled={!row.original.consentimento}
                title={!row.original.consentimento ? 'Sem opt-in LGPD' : undefined}
                onClick={() => enviarCrm(row.original.id)}
              >
                <Send className="size-4" /> Enviar ao CRM
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-7" aria-label="Ações">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                  <Pencil className="mr-2 size-4" /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDeleting(row.original)} className="text-destructive">
                  <Trash2 className="mr-2 size-4" /> Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
        data={leads}
        searchPlaceholder="Buscar lead, origem..."
        emptyMessage="Nenhum lead captado."
        toolbar={
          <Button onClick={handleNew}>
            <Plus className="size-4" /> Novo lead
          </Button>
        }
      />
      <NovoLeadDialog open={formOpen} onOpenChange={setFormOpen} lead={editing} onSaved={handleSaved} />
      <AlertDialog open={Boolean(deleting)} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir lead?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação removerá <strong>{deleting?.nome}</strong>. Não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarExclusao} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
