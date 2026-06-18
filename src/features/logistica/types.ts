import type { OSStatus } from './constants'

export interface ChecklistItem {
  label: string
  ok: boolean
}

export interface ChecklistFase {
  fase: string
  itens: ChecklistItem[]
}

export interface Avaria {
  peca: string
  descricao: string
}

export interface OrdemServico {
  id: number
  codigo: string
  cliente: string
  ambiente: string
  equipe: string
  veiculo: string
  agenda: string // ISO
  status: OSStatus
  checkIn: string | null
  checkOut: string | null
  checklist: ChecklistFase[]
  avarias: Avaria[]
}

export interface Equipe {
  nome: string
  membros: string[]
}
