import type { Pedido } from './types'

export const PEDIDOS: Pedido[] = [
  {
    id: 1,
    codigo: 'PC-2001',
    projeto: 'PRJ-0044',
    ambiente: 'Dormitório casal',
    fornecedor: 'Fábrica Móveis Sul',
    status: 'despachado',
    prazoEntrega: '2026-06-20',
    valor: 18900,
    itens: [
      { nome: 'Guarda-roupa 6 portas', qtd: 1 },
      { nome: 'Cabeceira estofada', qtd: 1 },
    ],
    divergencias: [],
  },
  {
    id: 2,
    codigo: 'PC-2002',
    projeto: 'PRJ-0042',
    ambiente: 'Cozinha planejada',
    fornecedor: 'MDF Premium Ind.',
    status: 'em-producao',
    prazoEntrega: '2026-06-28',
    valor: 31200,
    itens: [
      { nome: 'Módulo aéreo 800mm', qtd: 3 },
      { nome: 'Módulo base 600mm', qtd: 4 },
      { nome: 'Torre quente', qtd: 1 },
    ],
    divergencias: [],
  },
  {
    id: 3,
    codigo: 'PC-2003',
    projeto: 'PRJ-0046',
    ambiente: 'Recepção comercial',
    fornecedor: 'Marcenaria Dália',
    status: 'em-producao',
    prazoEntrega: '2026-06-14', // já passou → atrasado
    valor: 27800,
    itens: [{ nome: 'Balcão recepção', qtd: 1 }, { nome: 'Painel ripado', qtd: 2 }],
    divergencias: [],
  },
  {
    id: 4,
    codigo: 'PC-2004',
    projeto: 'PRJ-0043',
    ambiente: 'Home office (12 un.)',
    fornecedor: 'Componentes RS',
    status: 'recebido',
    prazoEntrega: '2026-06-10',
    valor: 96400,
    itens: [
      { nome: 'Mesa em L 1600mm', qtd: 12 },
      { nome: 'Gaveteiro 3 gavetas', qtd: 12 },
    ],
    divergencias: [{ tipo: 'avariada', descricao: '1 gaveteiro com lateral riscada' }],
  },
]
