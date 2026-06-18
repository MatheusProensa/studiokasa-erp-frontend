import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { EtapaKey } from './constants'
import { PROJETOS } from './mock-data'
import type { Projeto } from './types'

export interface ProjetoFormValues {
  cliente: string
  ambiente: string
  projetista: string
  etapa: EtapaKey
  valor: number
  software: Projeto['software']
}

interface ProjetosContextValue {
  /** Lista completa (KPIs). */
  projetos: Projeto[]
  /** Lista aplicando o filtro por cliente (visões/tabela/kanban). */
  projetosVisiveis: Projeto[]
  filtroCliente: string | null
  setFiltroCliente: (nome: string | null) => void
  moverEtapa: (id: number, etapa: EtapaKey) => void
  aprovar: (id: number) => void
  salvar: (values: ProjetoFormValues, id?: number) => void
  remover: (id: number) => void
}

const ProjetosContext = createContext<ProjetosContextValue | null>(null)

export function ProjetosProvider({ children }: { children: ReactNode }) {
  const [projetos, setProjetos] = useState<Projeto[]>(PROJETOS)
  const [filtroCliente, setFiltroCliente] = useState<string | null>(null)

  const value = useMemo<ProjetosContextValue>(() => {
    const nowIso = () => new Date().toISOString()

    return {
      projetos,
      projetosVisiveis: filtroCliente
        ? projetos.filter((p) => p.cliente === filtroCliente)
        : projetos,
      filtroCliente,
      setFiltroCliente,
      moverEtapa: (id, etapa) =>
        setProjetos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, etapa, atualizadoEm: nowIso() } : p)),
        ),
      aprovar: (id) =>
        setProjetos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, aprovado: true, atualizadoEm: nowIso() } : p)),
        ),
      salvar: (values, id) =>
        setProjetos((prev) => {
          if (id) {
            return prev.map((p) => (p.id === id ? { ...p, ...values, atualizadoEm: nowIso() } : p))
          }
          const newId = Math.max(0, ...prev.map((p) => p.id)) + 1
          const codigo = `PRJ-${String(40 + newId).padStart(4, '0')}`
          return [
            {
              id: newId,
              codigo,
              versao: 1,
              aprovado: false,
              atualizadoEm: nowIso(),
              versoes: [
                { numero: 1, data: nowIso(), autor: values.projetista, resumo: 'Versão inicial' },
              ],
              pecas: [],
              ...values,
            },
            ...prev,
          ]
        }),
      remover: (id) => setProjetos((prev) => prev.filter((p) => p.id !== id)),
    }
  }, [projetos, filtroCliente])

  return <ProjetosContext.Provider value={value}>{children}</ProjetosContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProjetos() {
  const ctx = useContext(ProjetosContext)
  if (!ctx) throw new Error('useProjetos precisa estar dentro de <ProjetosProvider>')
  return ctx
}
