export interface Colaborador {
  id: number
  nome: string
  cargo: string
  unidade: string
  admissao: string // ISO date
  ativo: boolean
}

export interface Parceiro {
  id: number
  nome: string
  tipo: 'Montador' | 'Entregador' | 'Arquiteto'
  comissaoMes: number
  ativo: boolean
}

export const COLABORADORES: Colaborador[] = [
  { id: 1, nome: 'Marina Alves', cargo: 'Projetista', unidade: 'Loja Centro', admissao: '2023-03-15', ativo: true },
  { id: 2, nome: 'Carlos Dias', cargo: 'Supervisor de Vendas', unidade: 'Loja Centro', admissao: '2021-08-01', ativo: true },
  { id: 3, nome: 'Beatriz Souza', cargo: 'Analista Financeiro', unidade: 'Matriz', admissao: '2022-11-10', ativo: true },
  { id: 4, nome: 'André Lima', cargo: 'Estoquista', unidade: 'CD Logística', admissao: '2024-01-20', ativo: true },
  { id: 5, nome: 'Helena Castro', cargo: 'Conferente', unidade: 'CD Logística', admissao: '2023-06-05', ativo: false },
  { id: 6, nome: 'Paulo Mendes', cargo: 'Gerente', unidade: 'Matriz', admissao: '2020-02-17', ativo: true },
]

export const PARCEIROS: Parceiro[] = [
  { id: 1, nome: 'José Montador', tipo: 'Montador', comissaoMes: 3200, ativo: true },
  { id: 2, nome: 'Equipe Rápida Entregas', tipo: 'Entregador', comissaoMes: 2100, ativo: true },
  { id: 3, nome: 'Studio Lume Arquitetura', tipo: 'Arquiteto', comissaoMes: 4560, ativo: true },
  { id: 4, nome: 'Marcos Montagens', tipo: 'Montador', comissaoMes: 1800, ativo: false },
]

/** Resumo de ponto do dia (mock). */
export const PONTO_HOJE = { presentes: 18, faltas: 1, atrasos: 2, total: 21 }
