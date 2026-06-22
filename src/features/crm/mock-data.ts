import type { Cliente, Deal } from './types'

/** Oportunidades de exemplo — distribuídas pelas etapas do funil. */
export const DEALS: Deal[] = [
  { id: 1, cliente: 'Helena Moretti', origem: 'Indicação', etapa: 'orcamento-enviado', valor: 42800, vendedor: 'Marina Alves', score: 'alta', proximaAcao: 'Aguardar retorno', ultimoContato: '2026-06-17', probabilidade: 60 },
  { id: 2, cliente: 'Construtora Vega Ltda', origem: 'Arquiteto', etapa: 'negociacao', valor: 158200, vendedor: 'Carlos Dias', score: 'alta', proximaAcao: 'Ajustar proposta', ultimoContato: '2026-06-17', probabilidade: 80 },
  { id: 3, cliente: 'Rafael Nunes', origem: 'Loja física', etapa: 'fechado', valor: 23400, vendedor: 'Marina Alves', score: 'media', proximaAcao: 'Gerar contrato', ultimoContato: '2026-06-16', probabilidade: 100 },
  { id: 4, cliente: 'Joana Prado', origem: 'Instagram', etapa: 'primeiro-contato', valor: 0, vendedor: 'Rui Pena', score: 'baixa', proximaAcao: 'Ligar amanhã', ultimoContato: '2026-06-16', probabilidade: 20 },
  { id: 5, cliente: 'Ana Beatriz Souza', origem: 'Indicação', etapa: 'orcamento-enviado', valor: 67900, vendedor: 'Rui Pena', score: 'media', proximaAcao: 'Reunião agendada', ultimoContato: '2026-06-16', probabilidade: 70 },
  { id: 6, cliente: 'Marcos Lima', origem: 'Anúncio', etapa: 'perdido', valor: 18900, vendedor: 'Carlos Dias', score: 'baixa', proximaAcao: 'Sem ação', ultimoContato: '2026-06-10', probabilidade: 0 },
  { id: 7, cliente: 'Studio Lume Arquitetura', origem: 'Arquiteto', etapa: 'negociacao', valor: 51300, vendedor: 'Carlos Dias', score: 'alta', proximaAcao: 'Desconto especial', ultimoContato: '2026-06-14', probabilidade: 50 },
  { id: 8, cliente: 'Pedro Hauser', origem: 'Instagram', etapa: 'primeiro-contato', valor: 0, vendedor: 'Marina Alves', score: 'media', proximaAcao: 'Enviar portfólio', ultimoContato: '2026-06-15', probabilidade: 30 },
  { id: 9, cliente: 'Família Tonin', origem: 'Loja física', etapa: 'fechado', valor: 89500, vendedor: 'Rui Pena', score: 'alta', proximaAcao: 'Gerar contrato', ultimoContato: '2026-06-13', probabilidade: 100 },
  { id: 10, cliente: 'Clara Bevilacqua', origem: 'Indicação', etapa: 'negociacao', valor: 34200, vendedor: 'Marina Alves', score: 'media', proximaAcao: 'Follow-up', ultimoContato: '2026-06-15', probabilidade: 55 },
]

export const CLIENTES: Cliente[] = [
  { id: 1, nome: 'Helena Moretti', tipo: 'PF', documento: '123.456.789-09', telefone: '(11) 98877-1020', email: 'helena@email.com', cidade: 'São Paulo', origem: 'Indicação' },
  { id: 2, nome: 'Construtora Vega Ltda', tipo: 'PJ', documento: '12.345.678/0001-90', telefone: '(11) 3344-5566', email: 'contato@vega.com.br', cidade: 'Campinas', origem: 'Arquiteto' },
  { id: 3, nome: 'Rafael Nunes', tipo: 'PF', documento: '987.654.321-00', telefone: '(11) 99123-4567', email: 'rafael.nunes@email.com', cidade: 'Santo André', origem: 'Loja física' },
  { id: 4, nome: 'Ana Beatriz Souza', tipo: 'PF', documento: '456.789.123-11', telefone: '(11) 98123-9090', email: 'anabeatriz@email.com', cidade: 'São Paulo', origem: 'Indicação' },
  { id: 5, nome: 'Studio Lume Arquitetura', tipo: 'PJ', documento: '23.456.789/0001-01', telefone: '(11) 3567-8899', email: 'projetos@studiolume.com', cidade: 'São Paulo', origem: 'Arquiteto' },
  { id: 6, nome: 'Família Tonin', tipo: 'PF', documento: '321.654.987-22', telefone: '(19) 99888-7766', email: 'tonin@email.com', cidade: 'Valinhos', origem: 'Loja física' },
]
