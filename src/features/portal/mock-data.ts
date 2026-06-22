export interface EtapaPortal {
  label: string
  estado: 'concluida' | 'atual' | 'pendente'
  data?: string
}

export const JORNADA: EtapaPortal[] = [
  { label: 'Contrato assinado', estado: 'concluida', data: '05/05/2026' },
  { label: 'Projeto aprovado', estado: 'concluida', data: '12/05/2026' },
  { label: 'Medição final', estado: 'concluida', data: '20/05/2026' },
  { label: 'Em produção (fornecedor)', estado: 'atual', data: 'Previsão: 28/06/2026' },
  { label: 'A caminho', estado: 'pendente', data: 'Previsão: 02/07/2026' },
  { label: 'Montagem', estado: 'pendente', data: 'Previsão: 07/07/2026' },
]

export interface Agenda {
  id: number
  titulo: string
  quando: string // ISO
  confirmada: boolean
}

export const AGENDAS: Agenda[] = [
  { id: 1, titulo: 'Entrega prevista', quando: '2026-06-28T09:00:00', confirmada: false },
  { id: 2, titulo: 'Montagem', quando: '2026-06-29T08:00:00', confirmada: false },
]

export interface Aprovacao {
  id: number
  titulo: string
  descricao: string
}

export const APROVACOES: Aprovacao[] = [
  { id: 1, titulo: 'Revisão de acabamento', descricao: 'Alteração do puxador para perfil alumínio.' },
]

export interface Documento {
  nome: string
  tipo: string
}

export const DOCUMENTOS: Documento[] = [
  { nome: 'Contrato de venda', tipo: 'PDF' },
  { nome: 'Projeto 3D — Cozinha', tipo: 'PDF' },
  { nome: 'Manual de cuidados', tipo: 'PDF' },
]

export const PROJETO_CLIENTE = {
  cliente: 'Helena Moretti',
  ambiente: 'Cozinha planejada',
  codigo: 'PRJ-0042',
}
