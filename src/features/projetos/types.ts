import type { EtapaKey, Software3D } from './constants'

export interface Versao {
  numero: number
  data: string // ISO
  autor: string
  resumo: string
}

export interface Peca {
  nome: string
  acabamento: string
  qtd: number
}

export interface Projeto {
  id: number
  codigo: string
  cliente: string
  ambiente: string
  projetista: string
  etapa: EtapaKey
  valor: number
  software: Software3D
  versao: number
  aprovado: boolean
  atualizadoEm: string // ISO
  versoes: Versao[]
  pecas: Peca[]
}
