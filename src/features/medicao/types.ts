import type { MedicaoStatus, TipoMedicao } from './constants'

export interface ChecklistItem {
  label: string
  ok: boolean
}

export interface ChecklistGrupo {
  categoria: string
  itens: ChecklistItem[]
}

export interface Medicao {
  id: number
  codigo: string
  cliente: string
  projeto: string // código/ambiente do projeto vinculado
  ambiente: string
  tipo: TipoMedicao
  conferente: string
  agendaInicio: string // ISO
  status: MedicaoStatus
  checkIn: string | null
  checkOut: string | null
  valorVendido: number
  valorConferido: number | null // null até conferir
  checklist: ChecklistGrupo[]
  /** Liberada manualmente apesar da alçada estourada. */
  liberadaManual?: boolean
}
