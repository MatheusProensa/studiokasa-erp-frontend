import type { StatusTone } from '@/components/ui/status-badge'

export interface DealRow {
  nome: string
  origem: string
  etapa: { tone: StatusTone; label: string }
  valor: string
  vendedor: string
}

/** Oportunidades de exemplo — espelham o UI kit do design system. */
export const DEALS: DealRow[] = [
  { nome: 'Helena Moretti', origem: 'Indicação', etapa: { tone: 'info', label: 'Proposta enviada' }, valor: 'R$ 42.800', vendedor: 'Marina Alves' },
  { nome: 'Construtora Vega', origem: 'Site', etapa: { tone: 'warning', label: 'Em negociação' }, valor: 'R$ 158.200', vendedor: 'Carlos Dias' },
  { nome: 'Rafael Nunes', origem: 'Loja física', etapa: { tone: 'success', label: 'Fechado' }, valor: 'R$ 23.400', vendedor: 'Marina Alves' },
  { nome: 'Joana Prado', origem: 'Instagram', etapa: { tone: 'neutral', label: 'Novo lead' }, valor: '—', vendedor: 'Rui Pena' },
  { nome: 'Ana Beatriz', origem: 'Indicação', etapa: { tone: 'info', label: 'Proposta enviada' }, valor: 'R$ 67.900', vendedor: 'Rui Pena' },
  { nome: 'Marcos Lima', origem: 'Site', etapa: { tone: 'danger', label: 'Perdido' }, valor: 'R$ 18.900', vendedor: 'Carlos Dias' },
]
