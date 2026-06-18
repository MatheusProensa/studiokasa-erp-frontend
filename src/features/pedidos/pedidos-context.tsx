import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { STATUS_FLOW, type PedidoStatus } from './constants'
import { PEDIDOS } from './mock-data'
import type { Divergencia, Pedido } from './types'

export interface NovoPedidoValues {
  projeto: string
  ambiente: string
  fornecedor: string
  prazoEntrega: string
  valor: number
}

/** Atrasado: prazo já passou e ainda não foi recebido. */
export function estaAtrasado(p: Pedido): boolean {
  if (p.status === 'recebido') return false
  return new Date(p.prazoEntrega) < new Date(new Date().toDateString())
}

export function proximoStatus(s: PedidoStatus): PedidoStatus | null {
  const i = STATUS_FLOW.indexOf(s)
  return i >= 0 && i < STATUS_FLOW.length - 1 ? STATUS_FLOW[i + 1] : null
}

interface PedidosContextValue {
  pedidos: Pedido[]
  avancarStatus: (id: number) => void
  registrarDivergencia: (id: number, d: Divergencia) => void
  criarPedido: (v: NovoPedidoValues) => void
}

const PedidosContext = createContext<PedidosContextValue | null>(null)

export function PedidosProvider({ children }: { children: ReactNode }) {
  const [pedidos, setPedidos] = useState<Pedido[]>(PEDIDOS)

  const value = useMemo<PedidosContextValue>(
    () => ({
      pedidos,
      avancarStatus: (id) =>
        setPedidos((prev) =>
          prev.map((p) => {
            const next = proximoStatus(p.status)
            return p.id === id && next ? { ...p, status: next } : p
          }),
        ),
      registrarDivergencia: (id, d) =>
        setPedidos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, divergencias: [...p.divergencias, d] } : p)),
        ),
      criarPedido: (v) =>
        setPedidos((prev) => {
          const newId = Math.max(0, ...prev.map((p) => p.id)) + 1
          return [
            {
              id: newId,
              codigo: `PC-${2000 + newId}`,
              status: 'em-producao',
              itens: [],
              divergencias: [],
              ...v,
            },
            ...prev,
          ]
        }),
    }),
    [pedidos],
  )

  return <PedidosContext.Provider value={value}>{children}</PedidosContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePedidos() {
  const ctx = useContext(PedidosContext)
  if (!ctx) throw new Error('usePedidos precisa estar dentro de <PedidosProvider>')
  return ctx
}
