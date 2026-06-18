import type { StatusTone } from '@/components/ui/status-badge'

/** Status do item no estoque (Módulo 6). */
export type ItemStatus = 'disponivel' | 'reservado' | 'em-transito'

export const ITEM_STATUS_META: Record<ItemStatus, { label: string; tone: StatusTone }> = {
  disponivel: { label: 'Disponível', tone: 'success' },
  reservado: { label: 'Reservado', tone: 'warning' },
  'em-transito': { label: 'Em trânsito', tone: 'info' },
}

/** Categoria do item. */
export type Categoria = 'acabado' | 'acessorio'
export const CATEGORIA_LABEL: Record<Categoria, string> = {
  acabado: 'Produto acabado',
  acessorio: 'Acessório / ferragem',
}

/** Tipo de movimentação do Kardex. */
export type MovTipo = 'entrada' | 'saida' | 'transferencia'
export const MOV_META: Record<MovTipo, { label: string; tone: StatusTone }> = {
  entrada: { label: 'Entrada', tone: 'success' },
  saida: { label: 'Saída', tone: 'danger' },
  transferencia: { label: 'Transferência', tone: 'info' },
}

export const FILIAIS = ['Matriz', 'CD Logística', 'Loja Centro', 'Loja Norte', 'Loja Sul']
