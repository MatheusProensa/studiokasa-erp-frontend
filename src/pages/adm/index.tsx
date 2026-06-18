import { Users, ShieldCheck, Receipt, Percent } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UsuariosTab } from '@/features/adm/usuarios-tab'
import { PermissoesTab } from '@/features/adm/permissoes-tab'
import { FiscalTab } from '@/features/adm/fiscal-tab'
import { DescontoTab } from '@/features/adm/desconto-tab'

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
          <PermissoesTab />
        </TabsContent>
        <TabsContent value="fiscal" className="mt-6">
          <FiscalTab />
        </TabsContent>
        <TabsContent value="desconto" className="mt-6">
          <DescontoTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
