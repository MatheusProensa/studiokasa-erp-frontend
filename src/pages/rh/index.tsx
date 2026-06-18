import { Users, HardHat, UserCheck, UserX, Clock } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/patterns/stat-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ColaboradoresTab } from '@/features/rh/colaboradores-tab'
import { ParceirosTab } from '@/features/rh/parceiros-tab'
import { COLABORADORES, PONTO_HOJE } from '@/features/rh/mock-data'

export default function RhPage() {
  const ativos = COLABORADORES.filter((c) => c.ativo).length

  return (
    <div>
      <PageHeader
        breadcrumb="Suporte · RH e Pessoas"
        title="RH e Pessoas"
        description="Colaboradores, parceiros terceirizados e ponto."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Colaboradores ativos" value={String(ativos)} icon={UserCheck} />
        <StatCard label="Presentes hoje" value={`${PONTO_HOJE.presentes}/${PONTO_HOJE.total}`} icon={Clock} />
        <StatCard label="Faltas hoje" value={String(PONTO_HOJE.faltas)} icon={UserX} deltaDirection="down" />
      </div>

      <Tabs defaultValue="colaboradores" className="mt-6">
        <TabsList>
          <TabsTrigger value="colaboradores">
            <Users className="size-4" />
            Colaboradores
          </TabsTrigger>
          <TabsTrigger value="parceiros">
            <HardHat className="size-4" />
            Parceiros
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colaboradores" className="mt-6">
          <ColaboradoresTab />
        </TabsContent>
        <TabsContent value="parceiros" className="mt-6">
          <ParceirosTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
