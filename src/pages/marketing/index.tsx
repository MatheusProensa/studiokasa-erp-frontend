import { Megaphone, Users, Coins, Target } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/patterns/stat-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CampanhasTab } from '@/features/marketing/campanhas-tab'
import { LeadsTab } from '@/features/marketing/leads-tab'
import { CAMPANHAS, LEADS_MKT } from '@/features/marketing/mock-data'
import { formatBRL } from '@/lib/format'

export default function MarketingPage() {
  const investimento = CAMPANHAS.reduce((s, c) => s + c.investimento, 0)
  const leadsTotal = CAMPANHAS.reduce((s, c) => s + c.leads, 0)
  const cac = leadsTotal > 0 ? investimento / leadsTotal : 0

  return (
    <div>
      <PageHeader
        breadcrumb="Comercial · Marketing"
        title="Marketing"
        description="Campanhas, captação de leads e CAC."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Investimento" value={formatBRL(investimento)} icon={Coins} />
        <StatCard label="Leads captados" value={String(LEADS_MKT.length)} icon={Users} />
        <StatCard label="CAC médio" value={formatBRL(cac)} icon={Target} />
      </div>

      <Tabs defaultValue="campanhas" className="mt-6">
        <TabsList>
          <TabsTrigger value="campanhas">
            <Megaphone className="size-4" />
            Campanhas
          </TabsTrigger>
          <TabsTrigger value="leads">
            <Users className="size-4" />
            Leads
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campanhas" className="mt-6">
          <CampanhasTab />
        </TabsContent>
        <TabsContent value="leads" className="mt-6">
          <LeadsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
