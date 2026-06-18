import type { StatusTone } from '@/components/ui/status-badge'

/** Status da ordem de serviço de logística (Módulo 9). */
export type OSStatus = 'agendada' | 'em-rota' | 'em-montagem' | 'concluida'

export const OS_STATUS_META: Record<OSStatus, { label: string; tone: StatusTone }> = {
  agendada: { label: 'Agendada', tone: 'neutral' },
  'em-rota': { label: 'Em rota', tone: 'info' },
  'em-montagem': { label: 'Em montagem', tone: 'warning' },
  concluida: { label: 'Concluída', tone: 'success' },
}

export const OS_FLOW: OSStatus[] = ['agendada', 'em-rota', 'em-montagem', 'concluida']

export function proximoStatus(s: OSStatus): OSStatus | null {
  const i = OS_FLOW.indexOf(s)
  return i >= 0 && i < OS_FLOW.length - 1 ? OS_FLOW[i + 1] : null
}

/** Template do checklist de montagem por fase. */
export const CHECKLIST_FASES: { fase: string; itens: string[] }[] = [
  { fase: 'Entrega', itens: ['Conferir itens descarregados', 'Posicionar no ambiente'] },
  { fase: 'Pré-montagem', itens: ['Conferir medidas no local', 'Conferir ferragens'] },
  { fase: 'Pós-montagem', itens: ['Alinhamento e nível', 'Limpeza', 'Assinatura do cliente'] },
]

export const EQUIPES = ['Equipe A', 'Equipe B', 'Equipe C']
