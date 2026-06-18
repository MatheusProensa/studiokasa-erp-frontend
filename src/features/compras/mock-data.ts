import type { Cotacao, HistoricoPreco, SugestaoCompra } from './types'

export const COTACOES: Cotacao[] = [
  {
    id: 1,
    codigo: 'COT-3001',
    descricao: 'Ferragens e corrediças — lote junho',
    status: 'aberta',
    criadaEm: '2026-06-15T10:00:00',
    itens: ['Corrediça telescópica 450mm', 'Dobradiça curva', 'Puxador perfil 1,2m'],
    propostas: [
      { fornecedor: 'Componentes RS', valorTotal: 8420, prazoDias: 7 },
      { fornecedor: 'MDF Premium Ind.', valorTotal: 7980, prazoDias: 12 },
      { fornecedor: 'Marcenaria Dália', valorTotal: 8990, prazoDias: 5 },
    ],
  },
  {
    id: 2,
    codigo: 'COT-3002',
    descricao: 'Chapas MDF Branco TX 18mm',
    status: 'fechada',
    criadaEm: '2026-06-08T14:30:00',
    itens: ['MDF Branco TX 18mm (chapa)'],
    propostas: [
      { fornecedor: 'MDF Premium Ind.', valorTotal: 23400, prazoDias: 10, vencedora: true },
      { fornecedor: 'Fábrica Móveis Sul', valorTotal: 24100, prazoDias: 8 },
    ],
  },
  {
    id: 3,
    codigo: 'COT-3003',
    descricao: 'Acessórios de cozinha (aramados)',
    status: 'aberta',
    criadaEm: '2026-06-17T09:15:00',
    itens: ['Porta-temperos', 'Aramado canto', 'Lixeira embutida'],
    propostas: [
      { fornecedor: 'Componentes RS', valorTotal: 5600, prazoDias: 9 },
      { fornecedor: 'Marcenaria Dália', valorTotal: 5320, prazoDias: 14 },
    ],
  },
]

export const SUGESTOES: SugestaoCompra[] = [
  { item: 'Corrediça telescópica 450mm', estoqueAtual: 12, minimo: 40, sugestao: 60, melhorFornecedor: 'Componentes RS', precoUnit: 18.5 },
  { item: 'Dobradiça curva', estoqueAtual: 30, minimo: 100, sugestao: 150, melhorFornecedor: 'MDF Premium Ind.', precoUnit: 3.2 },
  { item: 'Parafuso 4x40 (cento)', estoqueAtual: 5, minimo: 20, sugestao: 30, melhorFornecedor: 'Componentes RS', precoUnit: 9.9 },
  { item: 'Fita de borda Branco TX', estoqueAtual: 80, minimo: 200, sugestao: 300, melhorFornecedor: 'MDF Premium Ind.', precoUnit: 1.1 },
]

export const HISTORICO: HistoricoPreco[] = [
  { item: 'MDF Branco TX 18mm (chapa)', fornecedor: 'MDF Premium Ind.', preco: 234.0, data: '2026-06-08T00:00:00' },
  { item: 'MDF Branco TX 18mm (chapa)', fornecedor: 'Fábrica Móveis Sul', preco: 241.0, data: '2026-05-12T00:00:00' },
  { item: 'Corrediça telescópica 450mm', fornecedor: 'Componentes RS', preco: 18.5, data: '2026-06-15T00:00:00' },
  { item: 'Corrediça telescópica 450mm', fornecedor: 'Marcenaria Dália', preco: 19.9, data: '2026-04-20T00:00:00' },
  { item: 'Dobradiça curva', fornecedor: 'MDF Premium Ind.', preco: 3.2, data: '2026-06-01T00:00:00' },
]
