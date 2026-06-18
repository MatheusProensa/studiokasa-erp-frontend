import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { proximoStatus } from './constants'
import { ORDENS } from './mock-data'
import type { Avaria, OrdemServico } from './types'

interface LogisticaContextValue {
  ordens: OrdemServico[]
  checkIn: (id: number) => void
  checkOut: (id: number) => void
  toggleItem: (id: number, fase: number, item: number) => void
  avancarStatus: (id: number) => void
  registrarAvaria: (id: number, a: Avaria) => void
}

const LogisticaContext = createContext<LogisticaContextValue | null>(null)

const nowIso = () => new Date().toISOString()

export function LogisticaProvider({ children }: { children: ReactNode }) {
  const [ordens, setOrdens] = useState<OrdemServico[]>(ORDENS)

  const update = (id: number, patch: (o: OrdemServico) => OrdemServico) =>
    setOrdens((prev) => prev.map((o) => (o.id === id ? patch(o) : o)))

  const value = useMemo<LogisticaContextValue>(
    () => ({
      ordens,
      checkIn: (id) => update(id, (o) => ({ ...o, checkIn: nowIso() })),
      checkOut: (id) => update(id, (o) => ({ ...o, checkOut: nowIso() })),
      toggleItem: (id, fase, item) =>
        update(id, (o) => ({
          ...o,
          checklist: o.checklist.map((f, fi) =>
            fi !== fase
              ? f
              : { ...f, itens: f.itens.map((it, ii) => (ii !== item ? it : { ...it, ok: !it.ok })) },
          ),
        })),
      avancarStatus: (id) =>
        update(id, (o) => {
          const next = proximoStatus(o.status)
          return next ? { ...o, status: next } : o
        }),
      registrarAvaria: (id, a) =>
        update(id, (o) => ({ ...o, avarias: [...o.avarias, a] })),
    }),
    [ordens],
  )

  return <LogisticaContext.Provider value={value}>{children}</LogisticaContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLogistica() {
  const ctx = useContext(LogisticaContext)
  if (!ctx) throw new Error('useLogistica precisa estar dentro de <LogisticaProvider>')
  return ctx
}
