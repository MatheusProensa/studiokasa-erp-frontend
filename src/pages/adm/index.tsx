import { useMemo, useRef, useState } from 'react'
import {
  Users, ShieldCheck, Receipt, Percent, ClipboardList,
  Plus, Upload, UserCog, Lock, KeyRound, Network, ArrowRight, ChevronDown,
} from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout/page-header'
import { UserFormDialog } from '@/features/adm/user-form-dialog'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { UsuariosTab } from '@/features/adm/usuarios-tab'
import { PermissoesTab } from '@/features/adm/permissoes-tab'
import { FiscalTab } from '@/features/adm/fiscal-tab'
import { DescontoTab } from '@/features/adm/desconto-tab'
import { LogsTab } from '@/features/adm/logs-tab'
import { PoliticaSenhaDialog, DEFAULT_POLITICA_SENHA, type PoliticaSenha } from '@/features/adm/politica-senha-dialog'
import { IntegracaoAdDialog, DEFAULT_INTEGRACAO_AD, type IntegracaoAd } from '@/features/adm/integracao-ad-dialog'
import { MOCK_USERS } from '@/features/adm/mock-data'
import type { SystemUser } from '@/features/adm/types'
import type { UserFormValues } from '@/features/adm/user-schema'

const IMPORTADOS_CSV: Omit<SystemUser, 'id'>[] = [
  { name: 'Juliana Costa', email: 'juliana@studiokasa.com', roles: ['vendedor'], status: 'ativo', unidade: 'Loja Centro', lastAccess: null, colaboradorId: null },
  { name: 'Vera Pimentel', email: 'vera@studiokasa.com', roles: ['conferente'], status: 'ativo', unidade: 'CD Logística', lastAccess: null, colaboradorId: null },
]

const RESUMO_PERMISSOES = [
  { icon: Users, label: 'Administradores', count: 2 },
  { icon: UserCog, label: 'Gerentes', count: 4 },
  { icon: Users, label: 'Usuários padrão', count: 10 },
  { icon: ShieldCheck, label: 'Somente leitura', count: 2 },
]

const ACESSOS_RAPIDOS_ADM = [
  { icon: UserCog, label: 'Gerenciar perfis' },
  { icon: Lock, label: 'Configurar permissões' },
  { icon: KeyRound, label: 'Política de senha' },
  { icon: Network, label: 'Integração com AD' },
]

const ATIVIDADES_RECENTES = [
  { label: 'Novo usuário cadastrado', sub: 'Juliana Costa', quando: 'Há 2 horas' },
  { label: 'Perfil atualizado', sub: 'Atendimento', quando: 'Há 5 horas' },
  { label: 'Permissão alterada', sub: 'Carlos Dias', quando: 'Há 1 dia' },
]

export default function AdmPage() {
  const [novoUserOpen, setNovoUserOpen] = useState(false)
  const [users, setUsers] = useState<SystemUser[]>(MOCK_USERS)
  const [activeTab, setActiveTab] = useState('usuarios')
  const [politicaSenha, setPoliticaSenha] = useState<PoliticaSenha>(DEFAULT_POLITICA_SENHA)
  const [politicaOpen, setPoliticaOpen] = useState(false)
  const [integracaoAd, setIntegracaoAd] = useState<IntegracaoAd>(DEFAULT_INTEGRACAO_AD)
  const [integracaoOpen, setIntegracaoOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const stats = useMemo(() => {
    const ativos = users.filter((u) => u.status === 'ativo').length
    const inativos = users.filter((u) => u.status === 'inativo').length
    return { ativos, inativos, total: users.length }
  }, [users])

  function handleNovoUsuario(values: UserFormValues) {
    setUsers((prev) => [
      { id: Math.max(0, ...prev.map((u) => u.id)) + 1, lastAccess: null, ...values },
      ...prev,
    ])
    setActiveTab('usuarios')
  }

  function handleImportarCsv() {
    setUsers((prev) => {
      let nextId = Math.max(0, ...prev.map((u) => u.id)) + 1
      const novos = IMPORTADOS_CSV.map((u) => ({ id: nextId++, ...u }))
      return [...novos, ...prev]
    })
    toast.success(`${IMPORTADOS_CSV.length} usuários importados do CSV.`)
    setActiveTab('usuarios')
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Sistema · Administração"
        title="Administração"
        description="Usuários, permissões e parametrização do sistema."
        actions={
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) handleImportarCsv()
                e.target.value = ''
              }}
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="size-4" />
              Importar usuários
            </Button>
            <Button onClick={() => setNovoUserOpen(true)}>
              <Plus className="size-4" />
              Novo usuário
              <ChevronDown className="size-4" />
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-5">
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">Usuários ativos</p>
            <p className="mt-2 text-3xl font-bold">{stats.ativos}</p>
            <p className="mt-1 text-xs text-muted-foreground">de {stats.total} usuários</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((stats.ativos / stats.total) * 100)}%` }} />
            </div>
            <p className="mt-1 text-xs font-semibold text-[var(--status-success)]">{Math.round((stats.ativos / stats.total) * 100)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">Perfis de acesso</p>
            <p className="mt-2 text-3xl font-bold">9</p>
            <p className="mt-1 text-xs text-muted-foreground">perfis cadastrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">Último acesso (hoje)</p>
            <p className="mt-2 text-3xl font-bold">15</p>
            <p className="mt-1 text-xs text-muted-foreground">usuários acessaram</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">Usuários inativos</p>
            <p className="mt-2 text-3xl font-bold">{stats.inativos}</p>
            <p className="mt-1 text-xs text-muted-foreground">usuários</p>
            <Button variant="link" size="sm" className="mt-1 h-auto p-0 text-xs text-primary" onClick={() => setActiveTab('usuarios')}>
              Ver detalhes
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">MFA habilitado</p>
            <p className="mt-2 text-3xl font-bold">12</p>
            <p className="mt-1 text-xs text-muted-foreground">usuários</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: '67%' }} />
            </div>
            <p className="mt-1 text-xs font-semibold text-emerald-600">67%</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_260px]">
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
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
              <TabsTrigger value="logs">
                <ClipboardList className="size-4" />
                Logs de auditoria
              </TabsTrigger>
            </TabsList>

            <TabsContent value="usuarios" className="mt-4">
              <UsuariosTab users={users} onUsersChange={setUsers} />
            </TabsContent>
            <TabsContent value="permissoes" className="mt-4">
              <PermissoesTab />
            </TabsContent>
            <TabsContent value="fiscal" className="mt-4">
              <FiscalTab />
            </TabsContent>
            <TabsContent value="desconto" className="mt-4">
              <DescontoTab />
            </TabsContent>
            <TabsContent value="logs" className="mt-4">
              <LogsTab />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <span className="text-sm font-semibold">Resumo de permissões</span>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setActiveTab('permissoes')}>
                Ver todos <ArrowRight className="size-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {RESUMO_PERMISSOES.map(({ icon: Icon, label, count }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Icon className="size-4" />
                    {label}
                  </span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <span className="text-sm font-semibold">Acessos rápidos</span>
            </CardHeader>
            <CardContent className="space-y-1">
              {ACESSOS_RAPIDOS_ADM.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  onClick={() => {
                    if (label === 'Gerenciar perfis') setActiveTab('permissoes')
                    else if (label === 'Configurar permissões') setActiveTab('permissoes')
                    else if (label === 'Política de senha') setPoliticaOpen(true)
                    else if (label === 'Integração com AD') setIntegracaoOpen(true)
                  }}
                >
                  <Icon className="size-4 text-primary" />
                  {label}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <span className="text-sm font-semibold">Atividades recentes</span>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setActiveTab('logs')}>
                Ver todas <ArrowRight className="size-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {ATIVIDADES_RECENTES.map((a) => (
                <div key={a.label} className="text-sm">
                  <p className="font-medium">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.sub}</p>
                  <p className="text-xs text-muted-foreground">{a.quando}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <UserFormDialog open={novoUserOpen} onOpenChange={setNovoUserOpen} user={null} onSubmit={handleNovoUsuario} />
      <PoliticaSenhaDialog open={politicaOpen} onOpenChange={setPoliticaOpen} value={politicaSenha} onSave={setPoliticaSenha} />
      <IntegracaoAdDialog open={integracaoOpen} onOpenChange={setIntegracaoOpen} value={integracaoAd} onSave={setIntegracaoAd} />
    </div>
  )
}
