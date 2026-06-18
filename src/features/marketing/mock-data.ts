import type { Campanha, LeadMkt } from './types'

export const CAMPANHAS: Campanha[] = [
  { id: 1, nome: 'Cozinhas planejadas — junho', canal: 'Instagram', status: 'ativa', investimento: 3200, leads: 48 },
  { id: 2, nome: 'Google Search — móveis sob medida', canal: 'Google', status: 'ativa', investimento: 5400, leads: 71 },
  { id: 3, nome: 'Remarketing — orçamentos abertos', canal: 'Facebook', status: 'pausada', investimento: 1800, leads: 22 },
  { id: 4, nome: 'Lançamento closet', canal: 'Landing page', status: 'encerrada', investimento: 900, leads: 15 },
]

export const LEADS_MKT: LeadMkt[] = [
  { id: 1, nome: 'Bianca Ferraz', origem: 'Instagram', score: 'alta', consentimento: true, status: 'qualificado' },
  { id: 2, nome: 'Otávio Reis', origem: 'Google', score: 'media', consentimento: true, status: 'novo' },
  { id: 3, nome: 'Camila Duarte', origem: 'Facebook', score: 'baixa', consentimento: false, status: 'novo' },
  { id: 4, nome: 'Eduardo Pires', origem: 'Landing page', score: 'alta', consentimento: true, status: 'qualificado' },
  { id: 5, nome: 'Larissa Gomes', origem: 'WhatsApp', score: 'media', consentimento: true, status: 'enviado' },
]
