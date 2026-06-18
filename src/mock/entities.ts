/**
 * Cadastro central de entidades (mock) — fonte de coerência entre módulos.
 * Os nomes aqui são os mesmos usados em CRM, Projetos, Medição, Financeiro e Fiscal,
 * garantindo que "Helena Moretti" seja a mesma pessoa em todo o ERP.
 * Ao plugar no Laravel, isto vira o resource de clientes vindo da API.
 */
export interface ClienteCentral {
  id: number
  nome: string
}

export const CLIENTES_CENTRAL: ClienteCentral[] = [
  { id: 1, nome: 'Helena Moretti' },
  { id: 2, nome: 'Construtora Vega' },
  { id: 3, nome: 'Rafael Nunes' },
  { id: 4, nome: 'Ana Beatriz' },
  { id: 5, nome: 'Studio Lume' },
  { id: 6, nome: 'Família Tonin' },
]
