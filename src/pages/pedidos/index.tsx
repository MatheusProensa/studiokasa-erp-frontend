import { useMemo } from 'react'
import { Factory, AlarmClock, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/patterns/stat-card'
import { PedidosProvider, usePedidos, estaAtrasado } from '@/features/pedidos/pedidos-context'
import { PedidosTable } from '@/features/pedidos/pedidos-table'

function PedidosKpis() {
  const { pedidos } = usePedidos()
  const stats = useMemo(() => {
    const emProducao = pedidos.filter((p) => p.status === 'em-producao').length
    const atrasados = pedidos.filter((p) => estaAtrasado(p)).length
    const comDivergencia = pedidos.filter((p) => p.divergencias.length > 0).length
    return { emProducao, atrasados, comDivergencia }
  }, [pedidos])

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="Em produção" value={String(stats.emProducao)} icon={Factory} />
      <StatCard label="Atrasados" value={String(stats.atrasados)} icon={AlarmClock} />
      <StatCard label="Com divergência" value={String(stats.comDivergencia)} icon={AlertTriangle} />
    </div>
  )
}

export default function PedidosPage() {
  return (
    <PedidosProvider>
      <div>
        <PageHeader
          breadcrumb="Operações · Pedido ao Fornecedor"
          title="Pedido ao Fornecedor"
          description="Acompanhamento de produção terceirizada e recebimento."
        />
        <PedidosKpis />
        <div className="mt-6">
          <PedidosTable />
        </div>
      </div>
    </PedidosProvider>
  )
}
