import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Pause, Play, Trash2, Pencil, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { DataTable } from '@/components/data-table/data-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { formatBRL } from '@/lib/format'
import { CAMPANHA_STATUS_META } from './constants'
import { CAMPANHAS as CAMPANHAS_INICIAIS, LEADS_MKT } from './mock-data'
import { NovaCampanhaDialog } from './nova-campanha-dialog'
import type { Campanha } from './types'

const CANAL_COLORS: Record<string, string> = {
  Instagram: 'bg-pink-100 text-pink-700',
  Google: 'bg-sky-100 text-sky-700',
  'Meta Ads': 'bg-blue-100 text-blue-700',
  'E-mail': 'bg-violet-100 text-violet-700',
}

/** Leads vinculados a uma campanha — fonte real, não número fixo. */
function leadsDaCampanha(campanhaId: number) {
  return LEADS_MKT.filter((l) => l.campanhaId === campanhaId)
}

export function CampanhasTab() {
  const [campanhas, setCampanhas] = useState<Campanha[]>(CAMPANHAS_INICIAIS)
  const [deleting, setDeleting] = useState<Campanha | null>(null)
  const [editing, setEditing] = useState<Campanha | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  function handleNew() {
    setEditing(null)
    setFormOpen(true)
  }

  function handleEdit(c: Campanha) {
    setEditing(c)
    setFormOpen(true)
  }

  function handleSaved(c: Campanha) {
    setCampanhas((prev) => {
      const idx = prev.findIndex((x) => x.id === c.id)
      return idx >= 0 ? prev.map((x) => (x.id === c.id ? c : x)) : [...prev, c]
    })
  }

  function alternarStatus(c: Campanha) {
    const novoStatus = c.status === 'ativa' ? 'pausada' : 'ativa'
    setCampanhas((prev) => prev.map((x) => (x.id === c.id ? { ...x, status: novoStatus } : x)))
    toast.success(novoStatus === 'ativa' ? `Campanha "${c.nome}" reativada.` : `Campanha "${c.nome}" pausada.`)
  }

  function confirmarExclusao() {
    if (!deleting) return
    const afetados = leadsDaCampanha(deleting.id)
    for (const lead of afetados) lead.campanhaId = null
    setCampanhas((prev) => prev.filter((x) => x.id !== deleting.id))
    toast.success(
      afetados.length > 0
        ? `Campanha "${deleting.nome}" excluída — ${afetados.length} lead(s) desvinculado(s).`
        : `Campanha "${deleting.nome}" excluída.`,
    )
    setDeleting(null)
  }

  const columns = useMemo<ColumnDef<Campanha>[]>(
    () => [
      {
        accessorKey: 'nome',
        header: 'Campanha',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-xs font-bold text-primary">
              {row.original.nome.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-medium">{row.original.nome}</span>
              <span className="text-xs text-muted-foreground">{row.original.tipo}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'canal',
        header: 'Canal',
        cell: ({ row }) => (
          <Badge className={`${CANAL_COLORS[row.original.canal] ?? 'bg-muted text-muted-foreground'} border-0`}>
            {row.original.canal}
          </Badge>
        ),
      },
      {
        accessorKey: 'responsavel',
        header: 'Responsável',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.responsavel}</span>,
      },
      {
        accessorKey: 'investimento',
        header: 'Investimento',
        cell: ({ row }) => <span className="tabular-nums">{formatBRL(row.original.investimento)}</span>,
      },
      {
        id: 'leads',
        header: 'Leads',
        cell: ({ row }) => (
          <span className="font-medium tabular-nums">{leadsDaCampanha(row.original.id).length}</span>
        ),
      },
      {
        id: 'cac',
        header: 'CAC',
        cell: ({ row }) => {
          const n = leadsDaCampanha(row.original.id).length
          return <span className="tabular-nums">{n > 0 ? formatBRL(row.original.investimento / n) : '—'}</span>
        },
      },
      {
        id: 'conversao',
        header: 'Conversão',
        cell: ({ row }) => {
          const leads = leadsDaCampanha(row.original.id)
          const enviados = leads.filter((l) => l.status === 'enviado').length
          const pct = leads.length > 0 ? Math.round((enviados / leads.length) * 100) : 0
          return <span className="font-medium tabular-nums">{leads.length > 0 ? `${pct}%` : '—'}</span>
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const s = CAMPANHA_STATUS_META[row.original.status]
          return <StatusBadge tone={s.tone}>{s.label}</StatusBadge>
        },
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
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
              <DropdownMenuItem onClick={() => alternarStatus(row.original)}>
                {row.original.status === 'ativa' ? (
                  <><Pause className="mr-2 size-4" /> Pausar campanha</>
                ) : (
                  <><Play className="mr-2 size-4" /> Reativar campanha</>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleting(row.original)} className="text-destructive">
                <Trash2 className="mr-2 size-4" /> Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [],
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={campanhas}
        searchPlaceholder="Buscar campanha, canal, responsável..."
        emptyMessage="Nenhuma campanha."
        toolbar={
          <Button onClick={handleNew}>
            <Plus className="size-4" /> Nova campanha
          </Button>
        }
      />
      <NovaCampanhaDialog open={formOpen} onOpenChange={setFormOpen} campanha={editing} onAdded={handleSaved} />
      <AlertDialog open={Boolean(deleting)} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir campanha?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação removerá <strong>{deleting?.nome}</strong>. Não pode ser desfeita.
              {deleting && leadsDaCampanha(deleting.id).length > 0 && (
                <> Os {leadsDaCampanha(deleting.id).length} lead(s) vinculados ficarão sem campanha de origem.</>
              )}
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
