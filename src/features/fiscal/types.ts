import type { NotaModelo, NotaStatus } from './constants'

/** Tributos da nota. IBS/CBS = Reforma Tributária (NT 2025.002). */
export interface Impostos {
  icms: number
  pis: number
  cofins: number
  ibs: number
  cbs: number
}

export interface NotaFiscal {
  id: number
  numero: string
  modelo: NotaModelo
  cliente: string
  ambiente: string
  valor: number
  emitidaEm: string // ISO
  status: NotaStatus
  impostos: Impostos
}

export interface NotaEntrada {
  id: number
  numero: string
  fornecedor: string
  valor: number
  credito: number // crédito tributário
  emitidaEm: string
  escriturada: boolean
}
