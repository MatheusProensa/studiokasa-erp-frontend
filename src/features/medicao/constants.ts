import type { StatusTone } from '@/components/ui/status-badge'

/** Status do ciclo de medição (Módulo 3). */
export type MedicaoStatus =
  | 'agendada'
  | 'em-andamento'
  | 'conferida'
  | 'aprovada'
  | 'bloqueada'
  | 'reprovada'

export const STATUS_META: Record<MedicaoStatus, { label: string; tone: StatusTone }> = {
  agendada: { label: 'Agendada', tone: 'neutral' },
  'em-andamento': { label: 'Em andamento', tone: 'info' },
  conferida: { label: 'Conferida', tone: 'info' },
  aprovada: { label: 'Aprovada', tone: 'success' },
  bloqueada: { label: 'Bloqueada (alçada)', tone: 'danger' },
  reprovada: { label: 'Reprovada', tone: 'danger' },
}

/** Tipo de medição — só a final libera o pedido ao fornecedor. */
export type TipoMedicao = 'preliminar' | 'final'

/** Limite de divergência de valor (alçada) — acima disso, bloqueia. */
export const LIMITE_DIVERGENCIA = 0.1 // 10%

/** Template de checklist configurável de medição. */
export const CHECKLIST_TEMPLATE: { categoria: string; itens: string[] }[] = [
  { categoria: 'Hidráulica', itens: ['Ponto de água', 'Ponto de esgoto', 'Registro/abrigo'] },
  { categoria: 'Elétrica / Gás / AC', itens: ['Tomadas e interruptores', 'Ponto de gás', 'Dreno do ar-condicionado'] },
  { categoria: 'Acabamentos', itens: ['Rodapé', 'Portas', 'Janelas'] },
  { categoria: 'Bancada / Revestimento', itens: ['Pedra/bancada', 'Revestimento', 'Eletrodomésticos'] },
]

export const CONFERENTES = ['Helena Castro', 'André Lima', 'Diego Faria']
