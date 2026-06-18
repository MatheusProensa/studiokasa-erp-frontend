import { UserPlus, Handshake, Target, KanbanSquare, List, Contact } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatCard } from '@/components/patterns/stat-card'
import { FunilKanban } from '@/features/crm/funil-kanban'
import { OportunidadesTab } from '@/features/crm/oportunidades-tab'
import { ClientesTab } from '@/features/crm/clientes-tab'

export default function CrmPage() {
  return (
    <div>
      <PageHeader
        breadcrumb="Comercial · CRM e Vendas"
        title="CRM e Vendas"
        description="Funil de oportunidades, clientes e negociações."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Leads abertos" value="38" icon={UserPlus} delta="+6" deltaNote="esta semana" />
        <StatCard label="Em negociação" value="R$ 312.400" icon={Handshake} />
        <StatCard label="Taxa de fechamento" value="34%" icon={Target} delta="+5%" deltaNote="vs. trimestre" />
      </div>

      <Tabs defaultValue="funil" className="mt-6">
        <TabsList>
          <TabsTrigger value="funil">
            <KanbanSquare className="size-4" />
            Funil
          </TabsTrigger>
          <TabsTrigger value="oportunidades">
            <List className="size-4" />
            Oportunidades
          </TabsTrigger>
          <TabsTrigger value="clientes">
            <Contact className="size-4" />
            Clientes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="funil" className="mt-6">
          <FunilKanban />
        </TabsContent>
        <TabsContent value="oportunidades" className="mt-6">
          <OportunidadesTab />
        </TabsContent>
        <TabsContent value="clientes" className="mt-6">
          <ClientesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
