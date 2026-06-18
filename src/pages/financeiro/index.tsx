import { useMemo } from 'react'
import { ArrowDownCircle, ArrowUpCircle, Percent, TrendingDown, TrendingUp, HandCoins, LineChart } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/patterns/stat-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FinanceiroProvider, useFinanceiro } from '@/features/financeiro/financeiro-context'
import { TitulosTab } from '@/features/financeiro/titulos-tab'
import { ComissoesTab } from '@/features/financeiro/comissoes-tab'
import { FluxoTab } from '@/features/financeiro/fluxo-tab'
import { formatBRL } from '@/lib/format'

function FinanceiroKpis() {
  const { titulos, comissoes } = useFinanceiro()
  const stats = useMemo(() => {
    const aReceber = titulos.filter((t) => t.tipo === 'receber' && t.status !== 'pago').reduce((s, t) => s + t.valor, 0)
    const aPagar = titulos.filter((t) => t.tipo === 'pagar' && t.status !== 'pago').reduce((s, t) => s + t.valor, 0)
    const comissoesPend = comissoes.filter((c) => c.status !== 'paga').reduce((s, c) => s + c.valor, 0)
    return { aReceber, aPagar, comissoesPend }
  }, [titulos, comissoes])

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="A receber (aberto)" value={formatBRL(stats.aReceber)} icon={TrendingUp} />
      <StatCard label="A pagar (aberto)" value={formatBRL(stats.aPagar)} icon={TrendingDown} />
      <StatCard label="Comissões a pagar" value={formatBRL(stats.comissoesPend)} icon={Percent} />
    </div>
  )
}

export default function FinanceiroPage() {
  return (
    <FinanceiroProvider>
      <div>
        <PageHeader
          breadcrumb="Financeiro · Financeiro"
          title="Financeiro"
          description="Contas a pagar e receber, comissões e fluxo de caixa."
        />
        <FinanceiroKpis />

        <Tabs defaultValue="receber" className="mt-6">
          <TabsList>
            <TabsTrigger value="receber">
              <ArrowDownCircle className="size-4" />
              A receber
            </TabsTrigger>
            <TabsTrigger value="pagar">
              <ArrowUpCircle className="size-4" />
              A pagar
            </TabsTrigger>
            <TabsTrigger value="comissoes">
              <HandCoins className="size-4" />
              Comissões
            </TabsTrigger>
            <TabsTrigger value="fluxo">
              <LineChart className="size-4" />
              Fluxo de caixa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="receber" className="mt-6">
            <TitulosTab tipo="receber" />
          </TabsContent>
          <TabsContent value="pagar" className="mt-6">
            <TitulosTab tipo="pagar" />
          </TabsContent>
          <TabsContent value="comissoes" className="mt-6">
            <ComissoesTab />
          </TabsContent>
          <TabsContent value="fluxo" className="mt-6">
            <FluxoTab />
          </TabsContent>
        </Tabs>
      </div>
    </FinanceiroProvider>
  )
}
