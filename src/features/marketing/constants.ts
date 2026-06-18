import type { StatusTone } from '@/components/ui/status-badge'

export type CampanhaStatus = 'ativa' | 'pausada' | 'encerrada'
export const CAMPANHA_STATUS_META: Record<CampanhaStatus, { label: string; tone: StatusTone }> = {
  ativa: { label: 'Ativa', tone: 'success' },
  pausada: { label: 'Pausada', tone: 'warning' },
  encerrada: { label: 'Encerrada', tone: 'neutral' },
}

export type LeadStatus = 'novo' | 'qualificado' | 'enviado'
export const LEAD_STATUS_META: Record<LeadStatus, { label: string; tone: StatusTone }> = {
  novo: { label: 'Novo', tone: 'info' },
  qualificado: { label: 'Qualificado', tone: 'warning' },
  enviado: { label: 'Enviado ao CRM', tone: 'success' },
}

export const CANAIS = ['Instagram', 'Google', 'Facebook', 'WhatsApp', 'Landing page'] as const
