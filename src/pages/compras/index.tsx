import { FileText, PackageSearch, History, Boxes, AlertTriangle, ShoppingCart } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/patterns/stat-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CotacoesTab } from '@/features/compras/cotacoes-tab'
import { SugestoesTab } from '@/features/compras/sugestoes-tab'
import { HistoricoTab } from '@/features/compras/historico-tab'
import { COTACOES, SUGESTOES } from '@/features/compras/mock-data'

export default function ComprasPage() {
  const cotacoesAbertas = COTACOES.filter((c) => c.status === 'aberta').length

  return (
    <div>
      <PageHeader
        breadcrumb="Operações · Compras e Suprimentos"
        title="Compras e Suprimentos"
        description="Cotações, sugestões de compra e histórico de preços."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Cotações abertas" value={String(cotacoesAbertas)} icon={ShoppingCart} />
        <StatCard label="Itens abaixo do mínimo" value={String(SUGESTOES.length)} icon={AlertTriangle} />
        <StatCard label="Fornecedores ativos" value="4" icon={Boxes} />
      </div>

      <Tabs defaultValue="cotacoes" className="mt-6">
        <TabsList>
          <TabsTrigger value="cotacoes">
            <FileText className="size-4" />
            Cotações
          </TabsTrigger>
          <TabsTrigger value="sugestoes">
            <PackageSearch className="size-4" />
            Sugestões
          </TabsTrigger>
          <TabsTrigger value="historico">
            <History className="size-4" />
            Histórico de preços
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cotacoes" className="mt-6">
          <CotacoesTab />
        </TabsContent>
        <TabsContent value="sugestoes" className="mt-6">
          <SugestoesTab />
        </TabsContent>
        <TabsContent value="historico" className="mt-6">
          <HistoricoTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
