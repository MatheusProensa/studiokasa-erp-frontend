import type { ChamadoStatus, Prioridade } from './constants'

export interface Chamado {
  id: number
  codigo: string
  cliente: string
  projeto: string
  assunto: string
  prioridade: Prioridade
  tecnico: string
  abertoEm: string // ISO
  status: ChamadoStatus
  pecaSolicitada: string | null
}

export interface Garantia {
  projeto: string
  cliente: string
  ambiente: string
  inicio: string // ISO
  fim: string // ISO
}
