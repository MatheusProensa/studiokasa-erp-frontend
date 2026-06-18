import type { StatusTone } from '@/components/ui/status-badge'

export type ChamadoStatus = 'aberto' | 'atendimento' | 'peca-solicitada' | 'encerrado'

export const CHAMADO_STATUS_META: Record<ChamadoStatus, { label: string; tone: StatusTone }> = {
  aberto: { label: 'Aberto', tone: 'info' },
  atendimento: { label: 'Em atendimento', tone: 'warning' },
  'peca-solicitada': { label: 'Peça solicitada', tone: 'warning' },
  encerrado: { label: 'Encerrado', tone: 'success' },
}

export type Prioridade = 'baixa' | 'media' | 'alta'
export const PRIORIDADE_META: Record<Prioridade, { label: string; tone: StatusTone }> = {
  baixa: { label: 'Baixa', tone: 'neutral' },
  media: { label: 'Média', tone: 'info' },
  alta: { label: 'Alta', tone: 'danger' },
}

export const TECNICOS = ['André Lima', 'Diego Faria', 'Helena Castro']
