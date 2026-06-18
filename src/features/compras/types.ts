export type CotacaoStatus = 'aberta' | 'fechada'

export interface Proposta {
  fornecedor: string
  valorTotal: number
  prazoDias: number
  vencedora?: boolean
}

export interface Cotacao {
  id: number
  codigo: string
  descricao: string
  status: CotacaoStatus
  criadaEm: string // ISO
  itens: string[]
  propostas: Proposta[]
}

export interface SugestaoCompra {
  item: string
  estoqueAtual: number
  minimo: number
  sugestao: number
  melhorFornecedor: string
  precoUnit: number
}

export interface HistoricoPreco {
  item: string
  fornecedor: string
  preco: number
  data: string // ISO
}
