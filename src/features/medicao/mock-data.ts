import { CHECKLIST_TEMPLATE } from './constants'
import type { ChecklistGrupo, Medicao } from './types'

/** Gera um checklist a partir do template; `allOk` marca todos como conferidos. */
export function buildChecklist(allOk = false): ChecklistGrupo[] {
  return CHECKLIST_TEMPLATE.map((g) => ({
    categoria: g.categoria,
    itens: g.itens.map((label) => ({ label, ok: allOk })),
  }))
}

export const MEDICOES: Medicao[] = [
  {
    id: 1,
    codigo: 'MED-0101',
    cliente: 'Helena Moretti',
    projeto: 'PRJ-0042',
    ambiente: 'Cozinha planejada',
    tipo: 'final',
    conferente: 'Helena Castro',
    agendaInicio: '2026-06-18T14:00:00',
    status: 'agendada',
    checkIn: null,
    checkOut: null,
    valorVendido: 42800,
    valorConferido: null,
    checklist: buildChecklist(false),
  },
  {
    id: 2,
    codigo: 'MED-0102',
    cliente: 'Rafael Nunes',
    projeto: 'PRJ-0044',
    ambiente: 'Dormitório casal',
    tipo: 'final',
    conferente: 'André Lima',
    agendaInicio: '2026-06-17T09:00:00',
    status: 'aprovada',
    checkIn: '2026-06-17T09:05:00',
    checkOut: '2026-06-17T10:10:00',
    valorVendido: 23400,
    valorConferido: 23900,
    checklist: buildChecklist(true),
  },
  {
    id: 3,
    codigo: 'MED-0103',
    cliente: 'Ana Beatriz Souza',
    projeto: 'PRJ-0045',
    ambiente: 'Closet + banheiro',
    tipo: 'preliminar',
    conferente: 'Diego Faria',
    agendaInicio: '2026-06-16T15:30:00',
    status: 'em-andamento',
    checkIn: '2026-06-16T15:35:00',
    checkOut: null,
    valorVendido: 67900,
    valorConferido: null,
    checklist: buildChecklist(false),
  },
  {
    id: 4,
    codigo: 'MED-0104',
    cliente: 'Construtora Vega Ltda',
    projeto: 'PRJ-0043',
    ambiente: 'Home office (12 un.)',
    tipo: 'final',
    conferente: 'Helena Castro',
    agendaInicio: '2026-06-15T10:00:00',
    status: 'bloqueada',
    checkIn: '2026-06-15T10:02:00',
    checkOut: '2026-06-15T12:30:00',
    valorVendido: 158200,
    valorConferido: 182600, // +15% → estoura a alçada de 10%
    checklist: buildChecklist(true),
  },
]
