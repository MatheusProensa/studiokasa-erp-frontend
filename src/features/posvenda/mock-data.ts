import type { Chamado, Garantia } from './types'

export const CHAMADOS: Chamado[] = [
  { id: 1, codigo: 'AS-501', cliente: 'Helena Moretti', projeto: 'PRJ-0042', assunto: 'Porta desalinhada', prioridade: 'media', tecnico: 'André Lima', abertoEm: '2026-06-16T10:00:00', status: 'atendimento', pecaSolicitada: null },
  { id: 2, codigo: 'AS-502', cliente: 'Construtora Vega Ltda', projeto: 'PRJ-0043', assunto: 'Gaveteiro com corrediça travando', prioridade: 'alta', tecnico: 'Diego Faria', abertoEm: '2026-06-17T08:30:00', status: 'peca-solicitada', pecaSolicitada: 'Corrediça telescópica 450mm' },
  { id: 3, codigo: 'AS-503', cliente: 'Rafael Nunes', projeto: 'PRJ-0044', assunto: 'Dúvida sobre limpeza do MDF', prioridade: 'baixa', tecnico: 'Helena Castro', abertoEm: '2026-06-15T14:20:00', status: 'encerrado', pecaSolicitada: null },
  { id: 4, codigo: 'AS-504', cliente: 'Família Tonin', projeto: 'PRJ-0048', assunto: 'Puxador solto', prioridade: 'media', tecnico: 'André Lima', abertoEm: '2026-06-18T09:10:00', status: 'aberto', pecaSolicitada: null },
]

export const GARANTIAS: Garantia[] = [
  { projeto: 'PRJ-0042', cliente: 'Helena Moretti', ambiente: 'Cozinha planejada', inicio: '2026-06-10', fim: '2031-06-10' },
  { projeto: 'PRJ-0044', cliente: 'Rafael Nunes', ambiente: 'Dormitório casal', inicio: '2026-06-08', fim: '2031-06-08' },
  { projeto: 'PRJ-0043', cliente: 'Construtora Vega Ltda', ambiente: 'Home office', inicio: '2026-06-12', fim: '2028-06-12' },
  { projeto: 'PRJ-0030', cliente: 'Marcos Lima', ambiente: 'Sala de estar', inicio: '2025-07-01', fim: '2026-07-01' },
]

/** NPS centralizado (fonte única). */
export const NPS = {
  score: 72,
  respostas: 148,
  promotores: 64,
  neutros: 22,
  detratores: 14,
}
