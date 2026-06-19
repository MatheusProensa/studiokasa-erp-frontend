import { useMemo } from 'react'
import { Boxes, Package, ArrowLeftRight, AlertTriangle, ClipboardList, Bell } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/patterns/stat-card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EstoqueProvider, useEstoque } from '@/features/estoque/estoque-context'
import { ItensTab } from '@/features/estoque/itens-tab'
import { KardexTab } from '@/features/estoque/kardex-tab'
import { InventarioTab } from '@/features/estoque/inventario-tab'
import { AlertasTab } from '@/features/estoque/alertas-tab'
import { itemNivel } from '@/features/estoque/level'

function contarAlertas(itens: ReturnType<typeof useEstoque>['itens']) {
  return itens.filter((i) => ['zerado', 'critico', 'atencao'].includes(itemNivel(i))).length
}

function EstoqueKpis() {
  const { itens, movimentos } = useEstoque()
  const stats = useMemo(() => {
    const skus = itens.length
    const baixoMinimo = itens.filter((i) => i.minimo > 0 && i.saldo < i.minimo).length
    const movHoje = movimentos.length
    return { skus, baixoMinimo, movHoje }
  }, [itens, movimentos])

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="SKUs em estoque" value={String(stats.skus)} icon={Package} />
      <StatCard label="Abaixo do mínimo" value={String(stats.baixoMinimo)} icon={AlertTriangle} tone="danger" />
      <StatCard label="Movimentações" value={String(stats.movHoje)} icon={ArrowLeftRight} />
    </div>
  )
}

function AlertasBadge() {
  const { itens } = useEstoque()
  const n = contarAlertas(itens)
  if (n === 0) return null
  return (
    <Badge variant="secondary" className="ml-1 bg-[var(--status-danger-soft)] text-[var(--status-danger)]">
      {n}
    </Badge>
  )
}

export default function EstoquePage() {
  return (
    <EstoqueProvider>
      <div>
        <PageHeader
          breadcrumb="Operações · Estoque e WMS"
          title="Estoque e Almoxarifado"
          description="Saldo, endereçamento, movimentações e inventário."
        />
        <EstoqueKpis />

        <Tabs defaultValue="itens" className="mt-6">
          <TabsList>
            <TabsTrigger value="itens">
              <Boxes className="size-4" />
              Itens
            </TabsTrigger>
            <TabsTrigger value="kardex">
              <ArrowLeftRight className="size-4" />
              Kardex
            </TabsTrigger>
            <TabsTrigger value="inventario">
              <ClipboardList className="size-4" />
              Inventário
            </TabsTrigger>
            <TabsTrigger value="alertas">
              <Bell className="size-4" />
              Alertas
              <AlertasBadge />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="itens" className="mt-6">
            <ItensTab />
          </TabsContent>
          <TabsContent value="kardex" className="mt-6">
            <KardexTab />
          </TabsContent>
          <TabsContent value="inventario" className="mt-6">
            <InventarioTab />
          </TabsContent>
          <TabsContent value="alertas" className="mt-6">
            <AlertasTab />
          </TabsContent>
        </Tabs>
      </div>
    </EstoqueProvider>
  )
}
