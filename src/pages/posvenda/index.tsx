import { useMemo } from 'react'
import { Headset, ShieldCheck, Smile, Wrench, Clock } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/patterns/stat-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PosvendaProvider, usePosvenda } from '@/features/posvenda/posvenda-context'
import { ChamadosTab } from '@/features/posvenda/chamados-tab'
import { GarantiasTab } from '@/features/posvenda/garantias-tab'
import { NpsTab } from '@/features/posvenda/nps-tab'
import { NPS } from '@/features/posvenda/mock-data'

function PosvendaKpis() {
  const { chamados } = usePosvenda()
  const stats = useMemo(() => {
    const abertos = chamados.filter((c) => c.status !== 'encerrado').length
    const pecas = chamados.filter((c) => c.status === 'peca-solicitada').length
    return { abertos, pecas }
  }, [chamados])

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="Chamados abertos" value={String(stats.abertos)} icon={Wrench} />
      <StatCard label="Aguardando peça" value={String(stats.pecas)} icon={Clock} />
      <StatCard label="NPS" value={String(NPS.score)} icon={Smile} />
    </div>
  )
}

export default function PosvendaPage() {
  return (
    <PosvendaProvider>
      <div>
        <PageHeader
          breadcrumb="Suporte · Pós-venda"
          title="Pós-venda e Assistência"
          description="Chamados de assistência, garantias e satisfação (NPS)."
        />
        <PosvendaKpis />

        <Tabs defaultValue="chamados" className="mt-6">
          <TabsList>
            <TabsTrigger value="chamados">
              <Headset className="size-4" />
              Chamados
            </TabsTrigger>
            <TabsTrigger value="garantias">
              <ShieldCheck className="size-4" />
              Garantias
            </TabsTrigger>
            <TabsTrigger value="nps">
              <Smile className="size-4" />
              NPS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chamados" className="mt-6">
            <ChamadosTab />
          </TabsContent>
          <TabsContent value="garantias" className="mt-6">
            <GarantiasTab />
          </TabsContent>
          <TabsContent value="nps" className="mt-6">
            <NpsTab />
          </TabsContent>
        </Tabs>
      </div>
    </PosvendaProvider>
  )
}
