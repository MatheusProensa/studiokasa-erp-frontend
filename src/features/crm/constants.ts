import type { StatusTone } from '@/components/ui/status-badge'

/** Etapas do funil de vendas (Kanban) — Módulo 1. */
export type StageKey =
  | 'primeiro-contato'
  | 'orcamento-enviado'
  | 'negociacao'
  | 'fechado'
  | 'perdido'

export const STAGES: { key: StageKey; label: string; tone: StatusTone }[] = [
  { key: 'primeiro-contato', label: 'Primeiro contato', tone: 'neutral' },
  { key: 'orcamento-enviado', label: 'Orçamento enviado', tone: 'info' },
  { key: 'negociacao', label: 'Negociação', tone: 'warning' },
  { key: 'fechado', label: 'Fechado', tone: 'success' },
  { key: 'perdido', label: 'Perdido', tone: 'danger' },
]

export const STAGE_MAP = Object.fromEntries(STAGES.map((s) => [s.key, s])) as Record<
  StageKey,
  (typeof STAGES)[number]
>

/** Origem do lead. */
export type Origem = 'Instagram' | 'Indicação' | 'Loja física' | 'Arquiteto' | 'Anúncio'
export const ORIGENS: Origem[] = ['Instagram', 'Indicação', 'Loja física', 'Arquiteto', 'Anúncio']

/** Lead scoring (chance de compra). */
export type Score = 'alta' | 'media' | 'baixa'
export const SCORE_META: Record<Score, { label: string; tone: StatusTone }> = {
  alta: { label: 'Alta', tone: 'success' },
  media: { label: 'Média', tone: 'warning' },
  baixa: { label: 'Baixa', tone: 'neutral' },
}

/** Tipo de pessoa do cliente. */
export type TipoPessoa = 'PF' | 'PJ'
