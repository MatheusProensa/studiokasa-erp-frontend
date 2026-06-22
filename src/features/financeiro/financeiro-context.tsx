import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { COMISSOES, TITULOS } from './mock-data'
import type { Comissao, Titulo } from './types'

interface FinanceiroContextValue {
  titulos: Titulo[]
  comissoes: Comissao[]
  quitar: (id: number) => void
  avancarComissao: (id: number) => void
  adicionarTitulo: (t: Omit<Titulo, 'id'>) => void
}

const FinanceiroContext = createContext<FinanceiroContextValue | null>(null)

export function FinanceiroProvider({ children }: { children: ReactNode }) {
  const [titulos, setTitulos] = useState<Titulo[]>(TITULOS)
  const [comissoes, setComissoes] = useState<Comissao[]>(COMISSOES)

  const value = useMemo<FinanceiroContextValue>(
    () => ({
      titulos,
      comissoes,
      quitar: (id) =>
        setTitulos((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'pago' } : t))),
      avancarComissao: (id) =>
        setComissoes((prev) =>
          prev.map((c) =>
            c.id !== id
              ? c
              : { ...c, status: c.status === 'pendente' ? 'liberada' : 'paga' },
          ),
        ),
      adicionarTitulo: (t) =>
        setTitulos((prev) => [...prev, { ...t, id: Math.max(0, ...prev.map((x) => x.id)) + 1 }]),
    }),
    [titulos, comissoes],
  )

  return <FinanceiroContext.Provider value={value}>{children}</FinanceiroContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFinanceiro() {
  const ctx = useContext(FinanceiroContext)
  if (!ctx) throw new Error('useFinanceiro precisa estar dentro de <FinanceiroProvider>')
  return ctx
}
