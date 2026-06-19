import type { Origem, Score, StageKey, TipoPessoa } from './constants'

/** Oportunidade / negociação no funil. */
export interface Deal {
  id: number
  cliente: string
  origem: Origem
  etapa: StageKey
  /** Valor em reais (mock). */
  valor: number
  vendedor: string
  score: Score
  /** Próximo passo do vendedor (ex: "Ligar amanhã"). */
  proximaAcao: string
  /** Data do último contato (ISO). */
  ultimoContato: string
  /** Probabilidade de fechamento 0–100. */
  probabilidade: number
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
