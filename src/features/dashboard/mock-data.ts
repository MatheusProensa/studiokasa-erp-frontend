import type { StatusTone } from '@/components/ui/status-badge'

/**
 * Dados de exemplo (mock) — espelham o UI kit do design system.
 * Ao plugar no Laravel/Inertia, virão das props do servidor.
 */

export interface ProjectRow {
  cliente: string
  ambiente: string
  projetista: string
  valor: string
  status: { tone: StatusTone; label: string }
}

export const RECENT_PROJECTS: ProjectRow[] = [
  { cliente: 'Helena Moretti', ambiente: 'Cozinha planejada', projetista: 'Marina Alves', valor: 'R$ 42.800', status: { tone: 'info', label: 'Em produção' } },
  { cliente: 'Construtora Vega', ambiente: 'Home office (12 un.)', projetista: 'Carlos Dias', valor: 'R$ 158.200', status: { tone: 'warning', label: 'Aguardando medição' } },
  { cliente: 'Rafael Nunes', ambiente: 'Dormitório casal', projetista: 'Marina Alves', valor: 'R$ 23.400', status: { tone: 'success', label: 'Entregue' } },
  { cliente: 'Ana Beatriz', ambiente: 'Closet + banheiro', projetista: 'Rui Pena', valor: 'R$ 67.900', status: { tone: 'danger', label: 'Atrasado' } },
  { cliente: 'Studio Lume', ambiente: 'Recepção comercial', projetista: 'Carlos Dias', valor: 'R$ 51.300', status: { tone: 'neutral', label: 'Rascunho' } },
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
  { icon: 'wrench', title: 'Montagem — Ana Beatriz', when: 'Sex, 08:00' },
]
