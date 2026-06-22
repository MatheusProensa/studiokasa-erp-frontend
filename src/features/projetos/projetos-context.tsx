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

export type StatusFiltro = 'todos' | 'pendente' | 'aprovado'

interface ProjetosContextValue {
  /** Lista completa (KPIs). */
  projetos: Projeto[]
  /** Lista aplicando os filtros de cliente, status de aprovação e etapa (visões/tabela/kanban). */
  projetosVisiveis: Projeto[]
  filtroCliente: string | null
  setFiltroCliente: (nome: string | null) => void
  statusFiltro: StatusFiltro
  setStatusFiltro: (s: StatusFiltro) => void
  etapaFiltro: EtapaKey | null
  setEtapaFiltro: (e: EtapaKey | null) => void
  moverEtapa: (id: number, etapa: EtapaKey) => void
  aprovar: (id: number) => void
  salvar: (values: ProjetoFormValues, id?: number) => void
  remover: (id: number) => void
}

const ProjetosContext = createContext<ProjetosContextValue | null>(null)

export function ProjetosProvider({ children }: { children: ReactNode }) {
  const [projetos, setProjetos] = useState<Projeto[]>(PROJETOS)
  const [filtroCliente, setFiltroCliente] = useState<string | null>(null)
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>('todos')
  const [etapaFiltro, setEtapaFiltro] = useState<EtapaKey | null>(null)

  const value = useMemo<ProjetosContextValue>(() => {
    const nowIso = () => new Date().toISOString()

    let visiveis = filtroCliente ? projetos.filter((p) => p.cliente === filtroCliente) : projetos
    if (statusFiltro === 'pendente') visiveis = visiveis.filter((p) => !p.aprovado)
    else if (statusFiltro === 'aprovado') visiveis = visiveis.filter((p) => p.aprovado)
    if (etapaFiltro) visiveis = visiveis.filter((p) => p.etapa === etapaFiltro)

    return {
      projetos,
      projetosVisiveis: visiveis,
      filtroCliente,
      setFiltroCliente,
      statusFiltro,
      setStatusFiltro,
      etapaFiltro,
      setEtapaFiltro,
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
            return prev.map((p) => {
              if (p.id !== id) return p
              const mudou = (Object.keys(values) as (keyof typeof values)[]).some((k) => p[k] !== values[k])
              if (!mudou) return p
              const novaVersao = p.versao + 1
              return {
                ...p,
                ...values,
                versao: novaVersao,
                atualizadoEm: nowIso(),
                versoes: [
                  { numero: novaVersao, data: nowIso(), autor: values.projetista, resumo: 'Atualização de dados do projeto' },
                  ...p.versoes,
                ],
              }
            })
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
  }, [projetos, filtroCliente, statusFiltro, etapaFiltro])

  return <ProjetosContext.Provider value={value}>{children}</ProjetosContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProjetos() {
  const ctx = useContext(ProjetosContext)
  if (!ctx) throw new Error('useProjetos precisa estar dentro de <ProjetosProvider>')
  return ctx
}
