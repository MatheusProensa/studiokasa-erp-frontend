import type { ComissaoStatus, TituloStatus, TituloTipo } from './constants'

export interface Titulo {
  id: number
  tipo: TituloTipo
  descricao: string
  contraparte: string // cliente ou fornecedor
  categoria: string
  valor: number
  vencimento: string // ISO date
  status: TituloStatus
}

export interface Comissao {
  id: number
  beneficiario: string
  papel: string // Vendedor, Projetista, Arquiteto, Montador...
  referencia: string // contrato/projeto
  valor: number
  status: ComissaoStatus
}
