import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { ENTRADAS, NOTAS } from './mock-data'
import type { NotaEntrada, NotaFiscal } from './types'

interface FiscalContextValue {
  notas: NotaFiscal[]
  entradas: NotaEntrada[]
  cancelar: (id: number) => void
  reenviar: (id: number) => void
  escriturar: (id: number) => void
}

const FiscalContext = createContext<FiscalContextValue | null>(null)

export function FiscalProvider({ children }: { children: ReactNode }) {
  const [notas, setNotas] = useState<NotaFiscal[]>(NOTAS)
  const [entradas, setEntradas] = useState<NotaEntrada[]>(ENTRADAS)

  const value = useMemo<FiscalContextValue>(
    () => ({
      notas,
      entradas,
      cancelar: (id) =>
        setNotas((prev) => prev.map((n) => (n.id === id ? { ...n, status: 'cancelada' } : n))),
      reenviar: (id) =>
        setNotas((prev) => prev.map((n) => (n.id === id ? { ...n, status: 'autorizada' } : n))),
      escriturar: (id) =>
        setEntradas((prev) => prev.map((e) => (e.id === id ? { ...e, escriturada: true } : e))),
    }),
    [notas, entradas],
  )

  return <FiscalContext.Provider value={value}>{children}</FiscalContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFiscal() {
  const ctx = useContext(FiscalContext)
  if (!ctx) throw new Error('useFiscal precisa estar dentro de <FiscalProvider>')
  return ctx
}
