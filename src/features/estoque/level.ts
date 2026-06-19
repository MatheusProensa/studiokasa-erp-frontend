import type { EstoqueItem } from './types'

export type Nivel = 'zerado' | 'critico' | 'atencao' | 'ok' | 'na'

/** Semáforo de saldo: zerado, abaixo do mínimo (crítico), até 30% acima (atenção). */
export function nivelSaldo(saldo: number, minimo: number): Nivel {
  if (minimo <= 0) return 'na'
  if (saldo <= 0) return 'zerado'
  if (saldo < minimo) return 'critico'
  if (saldo <= minimo * 1.3) return 'atencao'
  return 'ok'
}

export const NIVEL_COR: Record<Nivel, string | null> = {
  zerado: 'var(--status-danger)',
  critico: 'var(--status-danger)',
  atencao: 'var(--status-warning)',
  ok: 'var(--status-success)',
  na: null,
}

export const NIVEL_LABEL: Record<Nivel, string> = {
  zerado: 'Zerado',
  critico: 'Crítico',
  atencao: 'Atenção',
  ok: 'Normal',
  na: '—',
}

export function itemNivel(i: EstoqueItem): Nivel {
  return nivelSaldo(i.saldo, i.minimo)
}
