import type { StatusTone } from '@/components/ui/status-badge'

/** Etapas do projeto (Módulo 2). */
export type EtapaKey = 'projeto' | 'medicao' | 'tecnico' | 'producao' | 'montagem'

export const ETAPAS: { key: EtapaKey; label: string; tone: StatusTone }[] = [
  { key: 'projeto', label: 'Projeto', tone: 'neutral' },
  { key: 'medicao', label: 'Medição', tone: 'info' },
  { key: 'tecnico', label: 'Projeto técnico', tone: 'info' },
  { key: 'producao', label: 'Em produção', tone: 'warning' },
  { key: 'montagem', label: 'Montagem', tone: 'success' },
]

export const ETAPA_MAP = Object.fromEntries(ETAPAS.map((e) => [e.key, e])) as Record<
  EtapaKey,
  (typeof ETAPAS)[number]
>

/** Softwares de projeto 3D suportados. */
export type Software3D = 'Promob' | 'Gabster' | 'SketchUp + plugin' | 'Dinabox'
export const SOFTWARES_3D: Software3D[] = ['Promob', 'Gabster', 'SketchUp + plugin', 'Dinabox']
