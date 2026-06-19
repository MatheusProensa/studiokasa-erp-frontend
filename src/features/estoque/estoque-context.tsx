import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { MovTipo } from './constants'
import { ITENS, MOVIMENTOS } from './mock-data'
import type { EstoqueItem, Movimento } from './types'

export interface MovimentoValues {
  sku: string
  tipo: MovTipo
  qtd: number
  ref?: string
  responsavel?: string
}

interface EstoqueContextValue {
  itens: EstoqueItem[]
  movimentos: Movimento[]
  registrarMovimento: (v: MovimentoValues) => void
}

/** Calcula o novo saldo conforme o tipo (ajuste define o saldo absoluto). */
function calcularSaldo(tipo: MovTipo, atual: number, qtd: number): number {
  if (tipo === 'entrada') return atual + qtd
  if (tipo === 'saida' || tipo === 'transferencia') return Math.max(0, atual - qtd)
  return Math.max(0, qtd) // ajuste = novo saldo
}

const EstoqueContext = createContext<EstoqueContextValue | null>(null)

export function EstoqueProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<EstoqueItem[]>(ITENS)
  const [movimentos, setMovimentos] = useState<Movimento[]>(MOVIMENTOS)

  const value = useMemo<EstoqueContextValue>(
    () => ({
      itens,
      movimentos,
      registrarMovimento: ({ sku, tipo, qtd, ref, responsavel }) => {
        const item = itens.find((i) => i.sku === sku)
        if (!item) return
        const antes = item.saldo
        const depois = calcularSaldo(tipo, antes, qtd)
        setItens((prev) => prev.map((i) => (i.sku === sku ? { ...i, saldo: depois } : i)))
        setMovimentos((prev) => [
          {
            id: Math.max(0, ...prev.map((m) => m.id)) + 1,
            data: new Date().toISOString(),
            tipo,
            sku,
            item: item.nome,
            qtd,
            ref: ref || '—',
            saldoAntes: antes,
            saldoDepois: depois,
            responsavel: responsavel || 'André Lima',
          },
          ...prev,
        ])
      },
    }),
    [itens, movimentos],
  )

  return <EstoqueContext.Provider value={value}>{children}</EstoqueContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEstoque() {
  const ctx = useContext(EstoqueContext)
  if (!ctx) throw new Error('useEstoque precisa estar dentro de <EstoqueProvider>')
  return ctx
}
