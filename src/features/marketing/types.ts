import type { Score } from '@/features/crm/constants'
import type { CampanhaStatus, LeadStatus } from './constants'

export interface Campanha {
  id: number
  nome: string
  canal: string
  status: CampanhaStatus
  investimento: number
  leads: number
}

export interface LeadMkt {
  id: number
  nome: string
  origem: string
  score: Score
  consentimento: boolean // opt-in LGPD
  status: LeadStatus
}
