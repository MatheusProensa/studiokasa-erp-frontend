import type { Origem, Score, StageKey, TipoPessoa } from './constants'

/** Oportunidade / negociação no funil. */
export interface Deal {
  id: number
  cliente: string
  origem: Origem
  etapa: StageKey
  /** Valor em centavos? Não — usamos number em reais pra simplicidade do mock. */
  valor: number
  vendedor: string
  score: Score
}

/** Cliente cadastrado (CRM). */
export interface Cliente {
  id: number
  nome: string
  tipo: TipoPessoa
  documento: string
  telefone: string
  email: string
  cidade: string
  origem: Origem
}
