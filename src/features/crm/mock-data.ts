import type { Cliente, Deal } from './types'

/** Oportunidades de exemplo — distribuídas pelas etapas do funil. */
export const DEALS: Deal[] = [
  { id: 1, cliente: 'Helena Moretti', origem: 'Indicação', etapa: 'orcamento-enviado', valor: 42800, vendedor: 'Marina Alves', score: 'alta' },
  { id: 2, cliente: 'Construtora Vega', origem: 'Arquiteto', etapa: 'negociacao', valor: 158200, vendedor: 'Carlos Dias', score: 'alta' },
  { id: 3, cliente: 'Rafael Nunes', origem: 'Loja física', etapa: 'fechado', valor: 23400, vendedor: 'Marina Alves', score: 'media' },
  { id: 4, cliente: 'Joana Prado', origem: 'Instagram', etapa: 'primeiro-contato', valor: 0, vendedor: 'Rui Pena', score: 'baixa' },
  { id: 5, cliente: 'Ana Beatriz', origem: 'Indicação', etapa: 'orcamento-enviado', valor: 67900, vendedor: 'Rui Pena', score: 'media' },
  { id: 6, cliente: 'Marcos Lima', origem: 'Anúncio', etapa: 'perdido', valor: 18900, vendedor: 'Carlos Dias', score: 'baixa' },
  { id: 7, cliente: 'Studio Lume', origem: 'Arquiteto', etapa: 'negociacao', valor: 51300, vendedor: 'Carlos Dias', score: 'alta' },
  { id: 8, cliente: 'Pedro Hauser', origem: 'Instagram', etapa: 'primeiro-contato', valor: 0, vendedor: 'Marina Alves', score: 'media' },
  { id: 9, cliente: 'Família Tonin', origem: 'Loja física', etapa: 'fechado', valor: 89500, vendedor: 'Rui Pena', score: 'alta' },
  { id: 10, cliente: 'Clara Bevilacqua', origem: 'Indicação', etapa: 'negociacao', valor: 34200, vendedor: 'Marina Alves', score: 'media' },
]

export const CLIENTES: Cliente[] = [
  { id: 1, nome: 'Helena Moretti', tipo: 'PF', documento: '123.456.789-09', telefone: '(11) 98877-1020', email: 'helena@email.com', cidade: 'São Paulo', origem: 'Indicação' },
  { id: 2, nome: 'Construtora Vega Ltda', tipo: 'PJ', documento: '12.345.678/0001-90', telefone: '(11) 3344-5566', email: 'contato@vega.com.br', cidade: 'Campinas', origem: 'Arquiteto' },
  { id: 3, nome: 'Rafael Nunes', tipo: 'PF', documento: '987.654.321-00', telefone: '(11) 99123-4567', email: 'rafael.nunes@email.com', cidade: 'Santo André', origem: 'Loja física' },
  { id: 4, nome: 'Ana Beatriz Souza', tipo: 'PF', documento: '456.789.123-11', telefone: '(11) 98123-9090', email: 'anabeatriz@email.com', cidade: 'São Paulo', origem: 'Indicação' },
  { id: 5, nome: 'Studio Lume Arquitetura', tipo: 'PJ', documento: '23.456.789/0001-01', telefone: '(11) 3567-8899', email: 'projetos@studiolume.com', cidade: 'São Paulo', origem: 'Arquiteto' },
  { id: 6, nome: 'Família Tonin', tipo: 'PF', documento: '321.654.987-22', telefone: '(19) 99888-7766', email: 'tonin@email.com', cidade: 'Valinhos', origem: 'Loja física' },
]
