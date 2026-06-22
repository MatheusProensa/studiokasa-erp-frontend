import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, HardHat, UserCheck, UserX, Clock, Timer, Clock3, CalendarDays, FileText, Star, BarChart2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { ColaboradoresTab } from '@/features/rh/colaboradores-tab'
import { ParceirosTab } from '@/features/rh/parceiros-tab'
import { ColaboradorFormDialog } from '@/features/rh/colaborador-form-dialog'
import { COLABORADORES, PONTO_HOJE } from '@/features/rh/mock-data'

const AVATAR_CORES = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-sky-500', 'bg-rose-500', 'bg-violet-500']

function initials(nome: string) {
  return nome.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

function aniversariantesDoMes(colaboradores: typeof COLABORADORES, hoje: Date) {
  const mes = hoje.getMonth()
  return colaboradores
    .filter((c) => c.nascimento && new Date(c.nascimento + 'T00:00:00').getMonth() === mes)
    .map((c) => {
      const dt = new Date(c.nascimento + 'T00:00:00')
      return { nome: c.nome, dia: dt.getDate(), data: dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) }
    })
    .sort((a, b) => a.dia - b.dia)
    .map((a, i) => ({ ...a, initials: initials(a.nome), cor: AVATAR_CORES[i % AVATAR_CORES.length] }))
}

const SPARKLINE_ATIVOS = [3, 3, 4, 4, 4, 5, 4, 5, 5, 5]
const SPARKLINE_PRESENTES = [16, 17, 15, 18, 19, 17, 18, 18, 19, 18]
const SPARKLINE_FALTAS = [2, 3, 1, 2, 2, 3, 1, 2, 1, 1]
const SPARKLINE_HORAS = [980, 1020, 970, 1050, 1100, 1080, 1120, 1150, 1200, 1248]

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const w = 160; const h = 36
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  })
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-9 w-full" preserveAspectRatio="none">
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="1.8" />
      <circle cx={pts[pts.length - 1].split(',')[0]} cy={pts[pts.length - 1].split(',')[1]} r="2.5" fill={color} />
    </svg>
  )
}

function RhStatCard({
  label, value, note, noteColor, icon: Icon, iconBg, sparkData, sparkColor,
}: {
  label: string; value: string; note: string; noteColor?: string
  icon: React.ElementType; iconBg: string; sparkData: number[]; sparkColor: string
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <p className="text-sm text-muted-foreground">{label}</p>
          <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
            <Icon className="size-4" />
          </div>
        </div>
        <p className="mt-2 text-3xl font-bold">{value}</p>
        <p className={`mt-1 text-xs font-medium ${noteColor ?? 'text-[var(--status-success)]'}`}>{note}</p>
        <div className="mt-3">
          <MiniSparkline data={sparkData} color={sparkColor} />
        </div>
      </CardContent>
    </Card>
  )
}

const ACOES = [
  { icon: Clock3, label: 'Registrar ponto', bg: 'bg-sky-50 text-sky-600' },
  { icon: Timer, label: 'Banco de horas', bg: 'bg-emerald-50 text-emerald-600' },
  { icon: CalendarDays, label: 'Férias', bg: 'bg-amber-50 text-amber-600' },
  { icon: UserX, label: 'Afastamentos', bg: 'bg-rose-50 text-rose-600' },
  { icon: FileText, label: 'Documentos', bg: 'bg-violet-50 text-violet-600' },
  { icon: Star, label: 'Avaliações', bg: 'bg-indigo-50 text-indigo-600' },
]

const PROXIMAS_FERIAS = [
  { nome: 'André Lima', periodo: '10/07/2026 a 19/07/2026', em: 'Em 21 dias' },
  { nome: 'Carlos Dias', periodo: '15/07/2026 a 24/07/2026', em: 'Em 26 dias' },
  { nome: 'Marina Alves', periodo: '01/08/2026 a 10/08/2026', em: 'Em 43 dias' },
]

const DOCS_PENDENTES = [
  { nome: 'Marina Alves', doc: 'Contrato de experiência' },
  { nome: 'Beatriz Souza', doc: 'ASO - Periódico' },
  { nome: 'Helena Castro', doc: 'Atualização cadastral' },
]

export default function RhPage() {
  const navigate = useNavigate()
  const ativos = COLABORADORES.filter((c) => c.ativo).length
  const [novoColabOpen, setNovoColabOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('colaboradores')
  const [pontoTick, setPontoTick] = useState(0)
  const aniversariantes = useMemo(() => aniversariantesDoMes(COLABORADORES, new Date()), [])

  function registrarPonto() {
    if (PONTO_HOJE.faltas > 0) {
      PONTO_HOJE.faltas -= 1
      PONTO_HOJE.presentes += 1
      setPontoTick((t) => t + 1)
      toast.success('Ponto registrado — presença atualizada.')
    } else {
      toast.info('Todos os colaboradores já estão presentes hoje.')
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Suporte · RH e Pessoas"
        title="RH e Pessoas"
        description="Colaboradores, parceiros terceirizados e gestão de ponto."
        actions={
          <>
            <Button variant="outline" onClick={() => navigate('/bi')}>
              <BarChart2 className="size-4" />
              Relatórios
            </Button>
            <Button onClick={() => setNovoColabOpen(true)}>
              <Plus className="size-4" />
              Novo colaborador
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <RhStatCard
          label="Colaboradores ativos"
          value={String(ativos)}
          note="+25% vs mês anterior"
          icon={UserCheck}
          iconBg="bg-sky-50 text-sky-600"
          sparkData={SPARKLINE_ATIVOS}
          sparkColor="#6366F1"
        />
        <RhStatCard
          key={pontoTick}
          label="Presentes hoje"
          value={`${PONTO_HOJE.presentes}/${PONTO_HOJE.total}`}
          note={`${Math.round((PONTO_HOJE.presentes / PONTO_HOJE.total) * 100)}% de presença`}
          noteColor="text-muted-foreground"
          icon={Clock}
          iconBg="bg-emerald-50 text-emerald-600"
          sparkData={SPARKLINE_PRESENTES}
          sparkColor="#10B981"
        />
        <RhStatCard
          label="Faltas hoje"
          value={String(PONTO_HOJE.faltas)}
          note="-50% vs mês anterior"
          noteColor="text-[var(--status-danger)]"
          icon={UserX}
          iconBg="bg-rose-50 text-rose-600"
          sparkData={SPARKLINE_FALTAS}
          sparkColor="#EF4444"
        />
        <RhStatCard
          label="Horas trabalhadas (mês)"
          value="1.248h"
          note="+12% vs mês anterior"
          icon={Timer}
          iconBg="bg-violet-50 text-violet-600"
          sparkData={SPARKLINE_HORAS}
          sparkColor="#6366F1"
        />
      </div>

      <Card className="mt-6">
        <CardHeader className="pb-3">
          <span className="font-semibold">Ações rápidas</span>
        </CardHeader>
        <CardContent>
          <div className="flex flex-nowrap gap-3 overflow-x-auto pb-1">
            {ACOES.map(({ icon: Icon, label, bg }) => (
              <button
                key={label}
                className="flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
                onClick={() => {
                  if (label === 'Avaliações') toast.info('Acesse a aba "Parceiros" para ver avaliações.')
                  else if (label === 'Documentos') toast.info('CPF, RG e demais dados estão no cadastro de cada colaborador (aba Colaboradores → Editar).')
                  else if (label === 'Banco de horas') toast.success('Banco de horas: saldo atual +42h. Relatório disponível em Relatórios.')
                  else if (label === 'Férias') toast.info('Próximas férias exibidas na barra lateral. Solicite ao gestor para registrar.')
                  else if (label === 'Afastamentos') toast.info('Afastamentos registrados via folha de ponto. Contate o RH para lançamento.')
                  else if (label === 'Registrar ponto') registrarPonto()
                  else toast.info(`${label} — disponível em breve.`)
                }}
              >
                <Icon className={`size-4 ${bg.split(' ')[1]}`} />
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Aniversariantes */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Aniversariantes do mês</span>
              <button className="text-xs text-primary hover:underline" onClick={() => toast.info('Cadastre a data de nascimento em "Colaboradores → Editar" para aparecer aqui.')}>Ver todos →</button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {aniversariantes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum aniversariante este mês.</p>
            ) : (
              aniversariantes.map(({ nome, data, initials: ini, cor }) => (
                <div key={nome} className="flex items-center gap-3">
                  <div className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${cor}`}>
                    {ini}
                  </div>
                  <span className="flex-1 text-sm font-medium">{nome}</span>
                  <span className="text-sm text-muted-foreground">{data}</span>
                  <button className="rounded border p-1 hover:bg-accent">
                    <CalendarDays className="size-3.5 text-muted-foreground" />
                  </button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Resumo de admissões */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Resumo de admissões</span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                <UserCheck className="size-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: 'Este mês', value: 1 },
              { label: 'Mês anterior', value: 2 },
              { label: 'Trimestre', value: 5 },
              { label: 'Ano', value: 12 },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Tabs */}
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
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

            <TabsContent value="colaboradores" className="mt-4">
              <ColaboradoresTab />
            </TabsContent>
            <TabsContent value="parceiros" className="mt-4">
              <ParceirosTab />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Próximas férias</span>
                <button className="text-xs text-primary hover:underline" onClick={() => toast.info('Solicite ao gestor para registrar férias de um colaborador específico na aba Colaboradores.')}>Ver todas →</button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {PROXIMAS_FERIAS.map(({ nome, periodo, em }) => (
                <div key={nome} className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{nome}</span>
                  <span className="text-xs text-muted-foreground">{periodo}</span>
                  <span className="mt-0.5 inline-flex w-fit rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700">{em}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Documentos pendentes</span>
                <button className="text-xs text-primary hover:underline" onClick={() => setActiveTab('colaboradores')}>Ver todos →</button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {DOCS_PENDENTES.map(({ nome, doc }) => (
                <div key={nome} className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{nome}</p>
                    <p className="text-xs text-muted-foreground">{doc}</p>
                  </div>
                  <StatusBadge tone="warning">Pendente</StatusBadge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Avaliações (mês)</span>
                <button className="text-xs text-primary hover:underline" onClick={() => setActiveTab('parceiros')}>Ver relatório →</button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-xs text-muted-foreground">Em andamento</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-xs text-muted-foreground">Concluídas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-xs text-muted-foreground">Pendentes</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: '57%' }} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ColaboradorFormDialog open={novoColabOpen} onOpenChange={setNovoColabOpen} />
    </div>
  )
}
