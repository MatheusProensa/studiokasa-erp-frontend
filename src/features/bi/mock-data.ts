export const VENDAS_MES = [
  { mes: 'Jan', valor: 142000 },
  { mes: 'Fev', valor: 158000 },
  { mes: 'Mar', valor: 134000 },
  { mes: 'Abr', valor: 176000 },
  { mes: 'Mai', valor: 169000 },
  { mes: 'Jun', valor: 184500 },
]

export const RANKING_VENDEDORES = [
  { nome: 'Carlos Dias', valor: 312400 },
  { nome: 'Marina Alves', valor: 268900 },
  { nome: 'Rui Pena', valor: 154300 },
  { nome: 'Luiza Antunes', valor: 98700 },
]

export const CURVA_ABC = [
  { nome: 'Construtora Vega Ltda', valor: 158200, classe: 'A' as const },
  { nome: 'Família Tonin', valor: 89500, classe: 'A' as const },
  { nome: 'Ana Beatriz Souza', valor: 67900, classe: 'B' as const },
  { nome: 'Studio Lume Arquitetura', valor: 51300, classe: 'B' as const },
  { nome: 'Helena Moretti', valor: 42800, classe: 'C' as const },
  { nome: 'Rafael Nunes', valor: 23400, classe: 'C' as const },
]

export const TERCEIRIZACAO = {
  prazoMedioDias: 11,
  pedidosNoPrazo: 86, // %
  otif: 81, // %
  divergencias: 3,
}

export const FINANCEIRO_BI = {
  conversao: 34, // %
  ticketMedio: 48200,
  margemMedia: 27, // %
  inadimplencia: 4.2, // %
}
