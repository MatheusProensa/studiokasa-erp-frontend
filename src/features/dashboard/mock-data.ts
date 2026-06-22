import type { StatusTone } from '@/components/ui/status-badge'

export interface ProjectRow {
  cliente: string
  ambiente: string
  projetista: string
  etapa: string
  etapaTone: StatusTone
  valor: string
  entrega: string
  status: { tone: StatusTone; label: string }
}

export const RECENT_PROJECTS: ProjectRow[] = [
  { cliente: 'Helena Moretti', ambiente: 'Cozinha planejada', projetista: 'Marina Alves', etapa: 'Em produção', etapaTone: 'info', valor: 'R$ 42.800', entrega: '28/06/2026', status: { tone: 'info', label: 'Em produção' } },
  { cliente: 'Construtora Vega Ltda', ambiente: 'Home office 1/2', projetista: 'Carlos Dias', etapa: 'Aguardando medição', etapaTone: 'warning', valor: 'R$ 158.200', entrega: '05/07/2026', status: { tone: 'warning', label: 'Aguardando medição' } },
  { cliente: 'Juliana Costa', ambiente: 'Closet planejado', projetista: 'Juliana Costa', etapa: 'Planejamento', etapaTone: 'neutral', valor: 'R$ 24.900', entrega: '12/07/2026', status: { tone: 'neutral', label: 'Planejamento' } },
  { cliente: 'Rafael Nunes', ambiente: 'Cozinha premium', projetista: 'Rui Pena', etapa: 'Em produção', etapaTone: 'info', valor: 'R$ 71.600', entrega: '22/07/2026', status: { tone: 'info', label: 'Em produção' } },
  { cliente: 'Empreendimento Horizon', ambiente: 'Área gourmet', projetista: 'André Lima', etapa: 'A caminho', etapaTone: 'success', valor: 'R$ 89.300', entrega: '30/07/2026', status: { tone: 'success', label: 'A caminho' } },
]

export interface AgendaItem {
  icon: string
  title: string
  when: string
}

export const WEEK_AGENDA: AgendaItem[] = [
  { icon: 'calendar-check', title: 'Medição — Helena Moretti', when: 'Hoje, 14:00' },
  { icon: 'truck', title: 'Entrega — Rafael Nunes', when: 'Amanhã, 09:00' },
  { icon: 'pen-tool', title: 'Aprovação projeto — Vega', when: 'Qui, 16:30' },
  { icon: 'wrench', title: 'Reunião de alinhamento', when: 'Sex, 10:00' },
]
