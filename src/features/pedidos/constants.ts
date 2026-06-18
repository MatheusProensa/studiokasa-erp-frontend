import type { StatusTone } from '@/components/ui/status-badge'

/** Status de produção no fornecedor (Módulo 4). */
export type PedidoStatus = 'em-producao' | 'pronto' | 'faturado' | 'despachado' | 'recebido'

export const STATUS_META: Record<PedidoStatus, { label: string; tone: StatusTone }> = {
  'em-producao': { label: 'Em produção', tone: 'info' },
  pronto: { label: 'Pronto', tone: 'info' },
  faturado: { label: 'Faturado', tone: 'warning' },
  despachado: { label: 'Despachado', tone: 'warning' },
  recebido: { label: 'Recebido', tone: 'success' },
}

/** Sequência do ciclo — usada para "avançar status". */
export const STATUS_FLOW: PedidoStatus[] = [
  'em-producao',
  'pronto',
  'faturado',
  'despachado',
  'recebido',
]

export type DivergenciaTipo = 'errada' | 'faltante' | 'avariada'
export const DIVERGENCIA_META: Record<DivergenciaTipo, string> = {
  errada: 'Peça errada',
  faltante: 'Peça faltante',
  avariada: 'Avariada de fábrica',
}

export const FORNECEDORES = ['Fábrica Móveis Sul', 'MDF Premium Ind.', 'Marcenaria Dália', 'Componentes RS']
