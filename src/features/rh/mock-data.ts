export interface Colaborador {
  id: number
  nome: string
  cargo: string
  unidade: string
  admissao: string // ISO date
  ativo: boolean
  // Dados pessoais e documentos
  nascimento?: string // ISO date
  cpf?: string
  rg?: string
  telefone?: string
  email?: string
  endereco?: string
  contatoEmergenciaNome?: string
  contatoEmergenciaTelefone?: string
}

export interface Parceiro {
  id: number
  nome: string
  tipo: 'Montador' | 'Entregador' | 'Arquiteto'
  comissaoMes: number
  ativo: boolean
}

export const COLABORADORES: Colaborador[] = [
  {
    id: 1, nome: 'Marina Alves', cargo: 'Projetista', unidade: 'Loja Centro', admissao: '2023-03-15', ativo: true,
    nascimento: '1991-06-22', cpf: '123.456.789-01', rg: '12.345.678-9', telefone: '(48) 99123-4567',
    email: 'marina.alves@studiokasa.com', endereco: 'Rua das Flores, 120 — Centro, Florianópolis/SC',
    contatoEmergenciaNome: 'Renato Alves', contatoEmergenciaTelefone: '(48) 99876-5432',
  },
  {
    id: 2, nome: 'Carlos Dias', cargo: 'Supervisor de Vendas', unidade: 'Loja Centro', admissao: '2021-08-01', ativo: true,
    nascimento: '1988-06-25', cpf: '234.567.890-12', rg: '23.456.789-0', telefone: '(48) 99234-5678',
    email: 'carlos.dias@studiokasa.com', endereco: 'Av. Beira-Mar, 450 — Centro, Florianópolis/SC',
    contatoEmergenciaNome: 'Fernanda Dias', contatoEmergenciaTelefone: '(48) 99765-4321',
  },
  {
    id: 3, nome: 'Beatriz Souza', cargo: 'Analista Financeiro', unidade: 'Matriz', admissao: '2022-11-10', ativo: true,
    nascimento: '1995-09-03', cpf: '345.678.901-23', rg: '34.567.890-1', telefone: '(48) 99345-6789',
    email: 'beatriz.souza@studiokasa.com', endereco: 'Rua Lauro Linhares, 880 — Trindade, Florianópolis/SC',
    contatoEmergenciaNome: 'Marcos Souza', contatoEmergenciaTelefone: '(48) 99654-3210',
  },
  {
    id: 4, nome: 'André Lima', cargo: 'Estoquista', unidade: 'CD Logística', admissao: '2024-01-20', ativo: true,
    nascimento: '1999-01-12', cpf: '456.789.012-34', rg: '45.678.901-2', telefone: '(48) 99456-7890',
    email: 'andre.lima@studiokasa.com', endereco: 'Rua João Pio Duarte Silva, 200 — Córrego Grande, Florianópolis/SC',
    contatoEmergenciaNome: 'Patrícia Lima', contatoEmergenciaTelefone: '(48) 99543-2109',
  },
  {
    id: 5, nome: 'Helena Castro', cargo: 'Conferente', unidade: 'CD Logística', admissao: '2023-06-05', ativo: false,
    nascimento: '1993-11-30', cpf: '567.890.123-45', rg: '56.789.012-3', telefone: '(48) 99567-8901',
    email: 'helena.castro@studiokasa.com', endereco: 'Rua Deputado Antônio Edu Vieira, 600 — Pantanal, Florianópolis/SC',
    contatoEmergenciaNome: 'Roberto Castro', contatoEmergenciaTelefone: '(48) 99432-1098',
  },
  {
    id: 6, nome: 'Paulo Mendes', cargo: 'Gerente', unidade: 'Matriz', admissao: '2020-02-17', ativo: true,
    nascimento: '1985-06-30', cpf: '678.901.234-56', rg: '67.890.123-4', telefone: '(48) 99678-9012',
    email: 'paulo.mendes@studiokasa.com', endereco: 'Av. Madre Benvenuta, 1500 — Itacorubi, Florianópolis/SC',
    contatoEmergenciaNome: 'Cláudia Mendes', contatoEmergenciaTelefone: '(48) 99321-0987',
  },
]

export const PARCEIROS: Parceiro[] = [
  { id: 1, nome: 'José Montador', tipo: 'Montador', comissaoMes: 3200, ativo: true },
  { id: 2, nome: 'Equipe Rápida Entregas', tipo: 'Entregador', comissaoMes: 2100, ativo: true },
  { id: 3, nome: 'Studio Lume Arquitetura', tipo: 'Arquiteto', comissaoMes: 4560, ativo: true },
  { id: 4, nome: 'Marcos Montagens', tipo: 'Montador', comissaoMes: 1800, ativo: false },
]

/** Resumo de ponto do dia (mock). */
export const PONTO_HOJE = { presentes: 18, faltas: 1, atrasos: 2, total: 21 }
