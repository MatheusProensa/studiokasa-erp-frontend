import type { StatusTone } from '@/components/ui/status-badge'

/** Tipo de título. */
export type TituloTipo = 'pagar' | 'receber'

/** Status de um título financeiro. */
export type TituloStatus = 'aberto' | 'pago' | 'vencido'

export const TITULO_STATUS_META: Record<TituloStatus, { label: string; tone: StatusTone }> = {
  aberto: { label: 'Em aberto', tone: 'info' },
  pago: { label: 'Quitado', tone: 'success' },
  vencido: { label: 'Vencido', tone: 'danger' },
}

/** Status de comissão (liberação conforme regra do Módulo 0). */
export type ComissaoStatus = 'pendente' | 'liberada' | 'paga'

export const COMISSAO_STATUS_META: Record<ComissaoStatus, { label: string; tone: StatusTone }> = {
  pendente: { label: 'Pendente', tone: 'warning' },
  liberada: { label: 'Liberada', tone: 'info' },
  paga: { label: 'Paga', tone: 'success' },
}

export const CATEGORIAS_PAGAR = ['Fornecedor', 'Folha', 'Imposto', 'Despesa fixa', 'Comissão']
export const FORMAS_RECEBER = ['Boleto', 'PIX', 'Cartão', 'Financiamento']
