import type { Campanha, LeadMkt } from './types'

export const CAMPANHAS: Campanha[] = [
  { id: 1, nome: 'Cozinhas planejadas — junho', tipo: 'Campanha institucional', canal: 'Instagram', responsavel: 'Renata Vargas', status: 'ativa', investimento: 3200 },
  { id: 2, nome: 'Google Search — móveis sob medida', tipo: 'Campanha de performance', canal: 'Google', responsavel: 'Renata Vargas', status: 'ativa', investimento: 5400 },
  { id: 3, nome: 'Facebook Ads — remarketing', tipo: 'Campanha de remarketing', canal: 'Meta Ads', responsavel: 'Carlos Dias', status: 'pausada', investimento: 1900 },
  { id: 4, nome: 'E-mail marketing — newsletter', tipo: 'Campanha de relacionamento', canal: 'E-mail', responsavel: 'Renata Vargas', status: 'ativa', investimento: 800 },
]

export const LEADS_MKT: LeadMkt[] = [
  { id: 1, nome: 'Bianca Ferraz', telefone: '(48) 99112-3344', origem: 'Instagram', campanhaId: 1, score: 'alta', consentimento: true, status: 'qualificado' },
  { id: 2, nome: 'Otávio Reis', telefone: '(48) 99223-4455', origem: 'Google', campanhaId: 2, score: 'media', consentimento: true, status: 'novo' },
  { id: 3, nome: 'Camila Duarte', telefone: '(48) 99334-5566', origem: 'Meta Ads', campanhaId: 3, score: 'baixa', consentimento: false, status: 'novo' },
  { id: 4, nome: 'Eduardo Pires', telefone: '(48) 99445-6677', origem: 'Landing page', campanhaId: null, score: 'alta', consentimento: true, status: 'qualificado' },
  { id: 5, nome: 'Larissa Gomes', telefone: '(48) 99556-7788', origem: 'WhatsApp', campanhaId: null, score: 'media', consentimento: true, status: 'enviado' },
]
