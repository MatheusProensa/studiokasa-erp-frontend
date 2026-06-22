import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { CHAMADOS } from './mock-data'
import type { Chamado } from './types'

interface PosvendaContextValue {
  chamados: Chamado[]
  atender: (id: number) => void
  solicitarPeca: (id: number, peca: string) => void
  encerrar: (id: number) => void
  adicionarChamado: (c: Omit<Chamado, 'id' | 'codigo' | 'abertoEm' | 'status' | 'pecaSolicitada'>) => void
}

const PosvendaContext = createContext<PosvendaContextValue | null>(null)

export function PosvendaProvider({ children }: { children: ReactNode }) {
  const [chamados, setChamados] = useState<Chamado[]>(CHAMADOS)

  const update = (id: number, patch: (c: Chamado) => Chamado) =>
    setChamados((prev) => prev.map((c) => (c.id === id ? patch(c) : c)))

  const value = useMemo<PosvendaContextValue>(
    () => ({
      chamados,
      atender: (id) => update(id, (c) => ({ ...c, status: 'atendimento' })),
      solicitarPeca: (id, peca) =>
        update(id, (c) => ({ ...c, status: 'peca-solicitada', pecaSolicitada: peca })),
      encerrar: (id) => update(id, (c) => ({ ...c, status: 'encerrado' })),
      adicionarChamado: (data) =>
        setChamados((prev) => {
          const id = Math.max(0, ...prev.map((c) => c.id)) + 1
          return [...prev, { ...data, id, codigo: `AS-${500 + id}`, abertoEm: new Date().toISOString(), status: 'aberto', pecaSolicitada: null }]
        }),
    }),
    [chamados],
  )

  return <PosvendaContext.Provider value={value}>{children}</PosvendaContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePosvenda() {
  const ctx = useContext(PosvendaContext)
  if (!ctx) throw new Error('usePosvenda precisa estar dentro de <PosvendaProvider>')
  return ctx
}
