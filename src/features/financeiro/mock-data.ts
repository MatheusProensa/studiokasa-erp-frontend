import type { Comissao, Titulo } from './types'

export const TITULOS: Titulo[] = [
  // A receber
  { id: 1, tipo: 'receber', descricao: 'Entrada cozinha — Helena Moretti', contraparte: 'Helena Moretti', categoria: 'PIX', valor: 21400, vencimento: '2026-06-20', status: 'aberto' },
  { id: 2, tipo: 'receber', descricao: 'Parcela 2/3 — Construtora Vega Ltda', contraparte: 'Construtora Vega Ltda', categoria: 'Boleto', valor: 52733, vencimento: '2026-06-12', status: 'vencido' },
  { id: 3, tipo: 'receber', descricao: 'Quitação dormitório — Rafael Nunes', contraparte: 'Rafael Nunes', categoria: 'Cartão', valor: 23400, vencimento: '2026-06-08', status: 'pago' },
  { id: 4, tipo: 'receber', descricao: 'Financiamento — Família Tonin', contraparte: 'Família Tonin', categoria: 'Financiamento', valor: 44750, vencimento: '2026-06-30', status: 'aberto' },
  // A pagar
  { id: 5, tipo: 'pagar', descricao: 'NF 8842 — MDF Premium', contraparte: 'MDF Premium Ind.', categoria: 'Fornecedor', valor: 23400, vencimento: '2026-06-22', status: 'aberto' },
  { id: 6, tipo: 'pagar', descricao: 'NF 1190 — Componentes RS', contraparte: 'Componentes RS', categoria: 'Fornecedor', valor: 8420, vencimento: '2026-06-10', status: 'vencido' },
  { id: 7, tipo: 'pagar', descricao: 'Folha de pagamento — junho', contraparte: 'Folha', categoria: 'Folha', valor: 38600, vencimento: '2026-06-30', status: 'aberto' },
  { id: 8, tipo: 'pagar', descricao: 'Simples Nacional — DAS', contraparte: 'Receita Federal', categoria: 'Imposto', valor: 12900, vencimento: '2026-06-20', status: 'aberto' },
  { id: 9, tipo: 'pagar', descricao: 'Aluguel — Loja Centro', contraparte: 'Imobiliária Prime', categoria: 'Despesa fixa', valor: 9800, vencimento: '2026-06-05', status: 'pago' },
]

export const COMISSOES: Comissao[] = [
  { id: 1, beneficiario: 'Marina Alves', papel: 'Vendedor', referencia: 'PRJ-0042', valor: 2140, status: 'pendente' },
  { id: 2, beneficiario: 'Carlos Dias', papel: 'Vendedor', referencia: 'PRJ-0043', valor: 7910, status: 'liberada' },
  { id: 3, beneficiario: 'Rui Pena', papel: 'Vendedor', referencia: 'PRJ-0044', valor: 1170, status: 'paga' },
  { id: 4, beneficiario: 'Studio Lume Arquitetura', papel: 'Arquiteto', referencia: 'PRJ-0046', valor: 2565, status: 'pendente' },
  { id: 5, beneficiario: 'José Montador', papel: 'Montador', referencia: 'PRJ-0044', valor: 800, status: 'liberada' },
]
