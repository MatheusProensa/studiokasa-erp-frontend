import type { DivergenciaTipo, PedidoStatus } from './constants'

export interface PedidoItem {
  nome: string
  qtd: number
}

export interface Divergencia {
  tipo: DivergenciaTipo
  descricao: string
}

export interface Pedido {
  id: number
  codigo: string
  projeto: string // código do projeto
  ambiente: string
  fornecedor: string
  status: PedidoStatus
  prazoEntrega: string // ISO date
  valor: number
  itens: PedidoItem[]
  divergencias: Divergencia[]
}
