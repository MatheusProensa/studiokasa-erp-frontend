import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { LIMITE_DIVERGENCIA, type TipoMedicao } from './constants'
import { buildChecklist, MEDICOES } from './mock-data'
import type { Medicao } from './types'

export interface AgendarValues {
  cliente: string
  projeto: string
  ambiente: string
  tipo: TipoMedicao
  conferente: string
  agendaInicio: string
  valorVendido: number
}

/** Divergência relativa entre vendido e conferido (0..n). null se não conferido. */
export function divergencia(m: Medicao): number | null {
  if (m.valorConferido == null || m.valorVendido === 0) return null
  return (m.valorConferido - m.valorVendido) / m.valorVendido
}

export function estourouAlcada(m: Medicao): boolean {
  const d = divergencia(m)
  return d != null && Math.abs(d) > LIMITE_DIVERGENCIA
}

interface MedicoesContextValue {
  medicoes: Medicao[]
  checkIn: (id: number) => void
  checkOut: (id: number) => void
  toggleItem: (id: number, grupo: number, item: number) => void
  conferirValor: (id: number, valor: number) => void
  aprovar: (id: number) => void
  reprovar: (id: number) => void
  liberarAlcada: (id: number) => void
  agendar: (values: AgendarValues) => void
}

const MedicoesContext = createContext<MedicoesContextValue | null>(null)

const nowIso = () => new Date().toISOString()

export function MedicoesProvider({ children }: { children: ReactNode }) {
  const [medicoes, setMedicoes] = useState<Medicao[]>(MEDICOES)

  const update = (id: number, patch: (m: Medicao) => Medicao) =>
    setMedicoes((prev) => prev.map((m) => (m.id === id ? patch(m) : m)))

  const value = useMemo<MedicoesContextValue>(
    () => ({
      medicoes,
      checkIn: (id) =>
        update(id, (m) => ({ ...m, checkIn: nowIso(), status: 'em-andamento' })),
      checkOut: (id) => update(id, (m) => ({ ...m, checkOut: nowIso(), status: 'conferida' })),
      toggleItem: (id, grupo, item) =>
        update(id, (m) => ({
          ...m,
          checklist: m.checklist.map((g, gi) =>
            gi !== grupo
              ? g
              : {
                  ...g,
                  itens: g.itens.map((it, ii) =>
                    ii !== item ? it : { ...it, ok: !it.ok },
                  ),
                },
          ),
        })),
      conferirValor: (id, valor) =>
        update(id, (m) => ({ ...m, valorConferido: valor, status: 'conferida' })),
      aprovar: (id) =>
        update(id, (m) => {
          const bloqueia = !m.liberadaManual && estourouAlcada(m)
          return { ...m, status: bloqueia ? 'bloqueada' : 'aprovada' }
        }),
      reprovar: (id) => update(id, (m) => ({ ...m, status: 'reprovada' })),
      liberarAlcada: (id) =>
        update(id, (m) => ({ ...m, liberadaManual: true, status: 'aprovada' })),
      agendar: (v) =>
        setMedicoes((prev) => {
          const newId = Math.max(0, ...prev.map((m) => m.id)) + 1
          return [
            {
              id: newId,
              codigo: `MED-${String(100 + newId).padStart(4, '0')}`,
              status: 'agendada',
              checkIn: null,
              checkOut: null,
              valorConferido: null,
              checklist: buildChecklist(false),
              ...v,
            },
            ...prev,
          ]
        }),
    }),
    [medicoes],
  )

  return <MedicoesContext.Provider value={value}>{children}</MedicoesContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMedicoes() {
  const ctx = useContext(MedicoesContext)
  if (!ctx) throw new Error('useMedicoes precisa estar dentro de <MedicoesProvider>')
  return ctx
}
