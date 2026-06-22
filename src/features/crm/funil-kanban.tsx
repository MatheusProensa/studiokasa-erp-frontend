import { useState } from 'react'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from '@dnd-kit/core'
import { GripVertical, Move, ArrowRightCircle, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { NameAvatar } from '@/components/ui/name-avatar'
import { cn } from '@/lib/utils'
import { formatBRL, formatDate } from '@/lib/format'
import { STAGES, SCORE_META, type StageKey } from './constants'
import { NovoLeadDialog } from './novo-lead-dialog'
import type { Deal } from './types'

const DOT: Record<string, string> = {
  info: 'var(--status-info)',
  success: 'var(--status-success)',
  warning: 'var(--status-warning)',
  danger: 'var(--status-danger)',
  neutral: 'var(--status-neutral)',
}

function DealCard({ deal }: { deal: Deal }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: deal.id })
  return (
    <div
      ref={setNodeRef}
      style={transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined}
      className={cn(
        'rounded-lg border bg-card p-3 shadow-sm',
        isDragging && 'opacity-50 shadow-md',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold leading-tight">{deal.cliente}</span>
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none rounded p-0.5 text-muted-foreground hover:bg-accent active:cursor-grabbing"
          aria-label="Arrastar"
        >
          <GripVertical className="size-4" />
        </button>
      </div>
      {deal.valor > 0 && <p className="mt-1 text-sm font-bold tabular-nums">{formatBRL(deal.valor)}</p>}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Badge variant="secondary">{deal.origem}</Badge>
        <StatusBadge tone={SCORE_META[deal.score].tone}>Score {SCORE_META[deal.score].label}</StatusBadge>
      </div>

      {/* Próxima ação + último contato */}
      <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px]">
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground">Próxima ação</span>
          <span className="flex items-center gap-1 font-medium">
            <ArrowRightCircle className="size-3 text-primary" />
            {deal.proximaAcao}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground">Último contato</span>
          <span className="flex items-center gap-1 font-medium">
            <Clock className="size-3 text-muted-foreground" />
            {formatDate(deal.ultimoContato)}
          </span>
        </div>
      </div>

      {/* Probabilidade */}
      {deal.etapa !== 'perdido' && (
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Probabilidade</span>
            <span className="font-semibold text-foreground">{deal.probabilidade}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-secondary" style={{ width: `${deal.probabilidade}%` }} />
          </div>
        </div>
      )}

      <div className="mt-2.5 flex items-center gap-2 border-t pt-2 text-xs text-muted-foreground">
        <NameAvatar name={deal.vendedor} size="sm" />
        {deal.vendedor}
      </div>
    </div>
  )
}

function Column({ stage, deals, onNovoLead }: { stage: (typeof STAGES)[number]; deals: Deal[]; onNovoLead: (etapa: StageKey) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.key })
  const total = deals.reduce((s, d) => s + d.valor, 0)
  return (
    <div className="flex w-72 shrink-0 flex-col">
      <div className="mb-3 flex items-center gap-2">
        <span className="size-2.5 rounded-full" style={{ backgroundColor: DOT[stage.tone] }} />
        <span className="text-sm font-semibold">{stage.label}</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {deals.length} · {formatBRL(total)}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          'flex flex-1 flex-col gap-2 rounded-xl bg-muted/50 p-2 transition-colors',
          isOver && 'bg-accent ring-2 ring-ring',
        )}
      >
        {deals.length === 0 && <p className="px-2 py-6 text-center text-xs text-muted-foreground">Solte aqui</p>}
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
        <button
          className="mt-1 rounded-lg border border-dashed py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          onClick={() => onNovoLead(stage.key)}
        >
          + Novo lead
        </button>
      </div>
    </div>
  )
}

export function FunilKanban({ deals, onDealsChange }: { deals: Deal[]; onDealsChange: (deals: Deal[]) => void }) {
  const [novoLeadEtapa, setNovoLeadEtapa] = useState<StageKey | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  function onDragEnd(e: DragEndEvent) {
    const id = Number(e.active.id)
    const etapa = e.over?.id as StageKey | undefined
    if (etapa) onDealsChange(deals.map((d) => (d.id === id ? { ...d, etapa } : d)))
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {STAGES.map((stage) => (
          <Column
            key={stage.key}
            stage={stage}
            deals={deals.filter((d) => d.etapa === stage.key)}
            onNovoLead={setNovoLeadEtapa}
          />
        ))}
      </div>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Move className="size-3.5" /> Arraste os cards para mover entre as etapas do funil
      </p>

      <NovoLeadDialog
        open={novoLeadEtapa !== null}
        onOpenChange={(o) => !o && setNovoLeadEtapa(null)}
        etapa={novoLeadEtapa ?? 'primeiro-contato'}
        onCreated={(deal) => onDealsChange([deal, ...deals])}
      />
    </DndContext>
  )
}
