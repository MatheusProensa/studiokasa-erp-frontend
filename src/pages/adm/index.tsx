import { Users, ShieldCheck, Receipt, Percent } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UsuariosTab } from '@/features/adm/usuarios-tab'

function SoonCard({ icon: Icon, text }: { icon: typeof Users; text: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <Icon className="size-9 text-muted-foreground" />
        <p className="max-w-md text-sm text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  )
}

export default function AdmPage() {
  return (
    <div>
      <PageHeader
        breadcrumb="Sistema · Administração"
        title="Administração"
        description="Usuários, permissões e parametrização do sistema."
      />

      <Tabs defaultValue="usuarios">
        <TabsList>
          <TabsTrigger value="usuarios">
            <Users className="size-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="permissoes">
            <ShieldCheck className="size-4" />
            Permissões
          </TabsTrigger>
          <TabsTrigger value="fiscal">
            <Receipt className="size-4" />
            Parâmetros fiscais
          </TabsTrigger>
          <TabsTrigger value="desconto">
            <Percent className="size-4" />
            Política de desconto
          </TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="mt-6">
          <UsuariosTab />
        </TabsContent>
        <TabsContent value="permissoes" className="mt-6">
          <SoonCard icon={ShieldCheck} text="Matriz de permissões por papel (RBAC) — próxima etapa do Módulo 0." />
        </TabsContent>
        <TabsContent value="fiscal" className="mt-6">
          <SoonCard icon={Receipt} text="Impostos, alíquotas e vigência tributária (Reforma 2026–2033) — próxima etapa." />
        </TabsContent>
        <TabsContent value="desconto" className="mt-6">
          <SoonCard icon={Percent} text="Alçadas de desconto por papel e comissões — próxima etapa." />
        </TabsContent>
      </Tabs>
    </div>
  )
}
