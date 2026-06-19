import type { Categoria, ItemStatus, MovTipo } from './constants'

export interface EstoqueItem {
  id: number
  sku: string
  nome: string
  categoria: Categoria
  saldo: number
  minimo: number
  endereco: string // ex: "Rua A · Nível 3 · Pos 12"
  status: ItemStatus
  lote: string
  filial: string
}

export interface Movimento {
  id: number
  data: string // ISO
  tipo: MovTipo
  sku: string
  item: string
  qtd: number
  ref: string // origem/documento (ex: PC-2002, OS-1009)
  saldoAntes: number
  saldoDepois: number
  responsavel: string
}

export interface InventarioLinha {
  sku: string
  item: string
  sistema: number
  fisico: number
}
