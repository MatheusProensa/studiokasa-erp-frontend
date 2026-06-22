import type { Score } from '@/features/crm/constants'
import type { CampanhaStatus, LeadStatus } from './constants'

export interface Campanha {
  id: number
  nome: string
  tipo: string
  canal: string
  responsavel: string
  status: CampanhaStatus
  investimento: number
}

export interface LeadMkt {
  id: number
  nome: string
  telefone?: string
  origem: string
  /** Campanha que gerou o lead; null = orgânico/sem campanha vinculada. */
  campanhaId: number | null
  score: Score
  consentimento: boolean // opt-in LGPD
  status: LeadStatus
}
