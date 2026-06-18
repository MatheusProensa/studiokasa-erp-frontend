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
import { GripVertical } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { NameAvatar } from '@/components/ui/name-avatar'
import { cn } from '@/lib/utils'
import { formatBRL } from '@/lib/format'
import { ETAPAS, type EtapaKey } from './constants'
import { useProjetos } from './projetos-context'
import { ProjetoDetailSheet } from './projeto-detail-sheet'
import type { Projeto } from './types'

function ProjetoCard({ projeto, onOpen }: { projeto: Projeto; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: projeto.id })
  return (
    <div
      ref={setNodeRef}
      style={transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined}
      className={cn('rounded-lg border bg-card p-3 shadow-sm', isDragging && 'opacity-50 shadow-md')}
    >
      <div className="flex items-start justify-between gap-2">
        <button onClick={onOpen} className="flex flex-col text-left leading-tight hover:underline">
          <span className="text-sm font-semibold">{projeto.ambiente}</span>
          <span className="text-xs text-muted-foreground">{projeto.cliente}</span>
        </button>
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none rounded p-0.5 text-muted-foreground hover:bg-accent active:cursor-grabbing"
          aria-label="Arrastar"
        >
          <GripVertical className="size-4" />
        </button>
      </div>
      <p className="mt-1 text-sm font-bold tabular-nums">{formatBRL(projeto.valor)}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Badge variant="secondary">{projeto.software}</Badge>
        <Badge variant="outline">v{projeto.versao}</Badge>
        {projeto.aprovado && <StatusBadge tone="success">Aprovado</StatusBadge>}
      </div>
      <div className="mt-2.5 flex items-center gap-2 border-t pt-2 text-xs text-muted-foreground">
        <NameAvatar name={projeto.projetista} size="sm" />
        {projeto.projetista}
      </div>
    </div>
  )
}

function Column({
  etapa,
  projetos,
  onOpen,
}: {
  etapa: (typeof ETAPAS)[number]
  projetos: Projeto[]
  onOpen: (p: Projeto) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: etapa.key })
  const total = projetos.reduce((s, p) => s + p.valor, 0)
  return (
    <div className="flex w-72 shrink-0 flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusBadge tone={etapa.tone}>{etapa.label}</StatusBadge>
          <span className="text-xs font-medium text-muted-foreground">{projetos.length}</span>
        </div>
        <span className="text-xs font-semibold tabular-nums text-muted-foreground">{formatBRL(total)}</span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          'flex flex-1 flex-col gap-2 rounded-xl bg-muted/50 p-2 transition-colors',
          isOver && 'bg-accent ring-2 ring-ring',
        )}
      >
        {projetos.length === 0 && <p className="px-2 py-6 text-center text-xs text-muted-foreground">Solte aqui</p>}
        {projetos.map((p) => (
          <ProjetoCard key={p.id} projeto={p} onOpen={() => onOpen(p)} />
        ))}
      </div>
    </div>
  )
}

export function ProjetosKanban() {
  const { projetos, moverEtapa } = useProjetos()
  const [detail, setDetail] = useState<Projeto | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  function onDragEnd(e: DragEndEvent) {
    const id = Number(e.active.id)
    const etapa = e.over?.id as EtapaKey | undefined
    if (etapa) moverEtapa(id, etapa)
  }

  return (
    <>
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {ETAPAS.map((etapa) => (
            <Column
              key={etapa.key}
              etapa={etapa}
              projetos={projetos.filter((p) => p.etapa === etapa.key)}
              onOpen={setDetail}
            />
          ))}
        </div>
      </DndContext>
      <ProjetoDetailSheet projeto={detail} onOpenChange={(o) => !o && setDetail(null)} />
    </>
  )
}
