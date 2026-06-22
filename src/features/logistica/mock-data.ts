import { CHECKLIST_FASES } from './constants'
import type { ChecklistFase, Equipe, OrdemServico } from './types'

export function buildChecklist(allOk = false): ChecklistFase[] {
  return CHECKLIST_FASES.map((f) => ({
    fase: f.fase,
    itens: f.itens.map((label) => ({ label, ok: allOk })),
  }))
}

export const ORDENS: OrdemServico[] = [
  {
    id: 1,
    codigo: 'OS-1009',
    cliente: 'Rafael Nunes',
    ambiente: 'Dormitório casal',
    equipe: 'Equipe A',
    veiculo: 'Fiorino · ABC-1D23',
    agenda: '2026-06-18T09:00:00',
    status: 'em-rota',
    checkIn: null,
    checkOut: null,
    checklist: buildChecklist(false),
    avarias: [],
  },
  {
    id: 2,
    codigo: 'OS-1010',
    cliente: 'Helena Moretti',
    ambiente: 'Cozinha planejada',
    equipe: 'Equipe B',
    veiculo: 'HR · DEF-4G56',
    agenda: '2026-06-19T08:00:00',
    status: 'agendada',
    checkIn: null,
    checkOut: null,
    checklist: buildChecklist(false),
    avarias: [],
  },
  {
    id: 3,
    codigo: 'OS-1008',
    cliente: 'Família Tonin',
    ambiente: 'Cozinha + área gourmet',
    equipe: 'Equipe A',
    veiculo: 'HR · DEF-4G56',
    agenda: '2026-06-16T13:30:00',
    status: 'em-montagem',
    checkIn: '2026-06-16T13:40:00',
    checkOut: null,
    checklist: buildChecklist(false),
    avarias: [{ peca: 'Porta do módulo 600mm', descricao: 'Risco na pintura durante o transporte' }],
  },
  {
    id: 4,
    codigo: 'OS-1005',
    cliente: 'Construtora Vega Ltda',
    ambiente: 'Home office (12 un.)',
    equipe: 'Equipe C',
    veiculo: 'Caminhão · GHI-7J89',
    agenda: '2026-06-12T08:00:00',
    status: 'concluida',
    checkIn: '2026-06-12T08:10:00',
    checkOut: '2026-06-12T17:30:00',
    checklist: buildChecklist(true),
    avarias: [],
  },
]

export const EQUIPES_INFO: Equipe[] = [
  { nome: 'Equipe A', membros: ['João Souza', 'Pedro Lima'] },
  { nome: 'Equipe B', membros: ['Marcos Reis', 'Luiz Antunes'] },
  { nome: 'Equipe C', membros: ['Diego Faria', 'Rafael Pena'] },
]
