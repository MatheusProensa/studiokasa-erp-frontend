import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  ArrowDownCircle, ArrowUpCircle, Percent, TrendingUp, TrendingDown,
  HandCoins, LineChart, Plus, ArrowLeftRight, FileSpreadsheet,
  Settings2, Landmark, ArrowRight, CreditCard,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/patterns/stat-card'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FinanceiroProvider, useFinanceiro } from '@/features/financeiro/financeiro-context'
import { NovoTituloDialog } from '@/features/financeiro/novo-titulo-dialog'
import { TitulosTab } from '@/features/financeiro/titulos-tab'
import { ComissoesTab } from '@/features/financeiro/comissoes-tab'
import { FluxoTab } from '@/features/financeiro/fluxo-tab'
import { formatBRL, formatDate } from '@/lib/format'

const ACOES_RAPIDAS = [
  { icon: Plus, label: 'Nova receita', color: 'text-emerald-600' },
  { icon: TrendingDown, label: 'Nova despesa', color: 'text-red-500' },
  { icon: ArrowLeftRight, label: 'Transferência', color: 'text-sky-600' },
  { icon: CreditCard, label: 'Conciliar contas', color: 'text-violet-600' },
  { icon: FileSpreadsheet, label: 'Exportar relatório', color: 'text-amber-600' },
  { icon: Settings2, label: 'Configurações', color: 'text-slate-500' },
]

const CONTAS_BANCARIAS_INICIAIS = [
  { banco: 'Banco do Brasil', agencia: 'Ag. 1234-5 · Cc. 67890-1', saldo: 45230, ativa: true },
  { banco: 'Bradesco', agencia: 'Ag. 2345-6 · Cc. 12345-6', saldo: 28560, ativa: true },
  { banco: 'Caixa Econômica', agencia: 'Ag. 3456-7 · Cc. 98765-4', saldo: 12875, ativa: true },
]

function DonutChart({ pct }: { pct: number }) {
  const r = 40
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg viewBox="0 0 100 100" className="size-24">
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="12" />
      <circle
        cx="50" cy="50" r={r} fill="none"
        stroke="var(--primary)" strokeWidth="12"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <text x="50" y="46" textAnchor="middle" className="text-sm font-bold" fill="currentColor" fontSize="16" fontWeight="700">{pct}%</text>
      <text x="50" y="60" textAnchor="middle" fill="currentColor" fontSize="8" opacity="0.6">Meta mensal</text>
    </svg>
  )
}

function FinanceiroContent() {
  const { titulos, comissoes } = useFinanceiro()
  const navigate = useNavigate()
  const [tituloTipo, setTituloTipo] = useState<'receber' | 'pagar'>('receber')
  const [tituloOpen, setTituloOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('receber')
  const [contas, setContas] = useState(CONTAS_BANCARIAS_INICIAIS)
  const [transfOpen, setTransfOpen] = useState(false)
  const [transfDe, setTransfDe] = useState('')
  const [transfPara, setTransfPara] = useState('')
  const [transfValor, setTransfValor] = useState(0)

  function openTitulo(tipo: 'receber' | 'pagar') { setTituloTipo(tipo); setTituloOpen(true) }

  function exportarCsv() {
    const header = ['Tipo', 'Descrição', 'Contraparte', 'Categoria', 'Valor', 'Vencimento', 'Status']
    const linhas = titulos.map((t) => [t.tipo, t.descricao, t.contraparte, t.categoria, t.valor, t.vencimento, t.status])
    const csv = [header, ...linhas].map((l) => l.join(';')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'relatorio-financeiro.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  function confirmarTransferencia() {
    if (!transfDe || !transfPara || transfDe === transfPara || transfValor <= 0) {
      toast.error('Selecione contas diferentes e um valor válido.')
      return
    }
    setContas((prev) => prev.map((c) => {
      if (c.banco === transfDe) return { ...c, saldo: c.saldo - transfValor }
      if (c.banco === transfPara) return { ...c, saldo: c.saldo + transfValor }
      return c
    }))
    toast.success(`${formatBRL(transfValor)} transferido(s) de ${transfDe} para ${transfPara}.`)
    setTransfOpen(false)
    setTransfDe(''); setTransfPara(''); setTransfValor(0)
  }

  const stats = useMemo(() => {
    const aReceber = titulos.filter((t) => t.tipo === 'receber' && t.status !== 'pago').reduce((s, t) => s + t.valor, 0)
    const aPagar = titulos.filter((t) => t.tipo === 'pagar' && t.status !== 'pago').reduce((s, t) => s + t.valor, 0)
    const comissoesPend = comissoes.filter((c) => c.status !== 'paga').reduce((s, c) => s + c.valor, 0)
    const fluxo = aReceber - aPagar
    return { aReceber, aPagar, comissoesPend, fluxo }
  }, [titulos, comissoes])

  const proximosVencimentos = useMemo(
    () => titulos
      .filter((t) => t.status !== 'pago')
      .sort((a, b) => a.vencimento.localeCompare(b.vencimento))
      .slice(0, 3),
    [titulos],
  )

  const comissoesAbertas = useMemo(
    () => comissoes.filter((c) => c.status !== 'paga'),
    [comissoes],
  )

  const totalContas = contas.reduce((s, c) => s + c.saldo, 0)
  const totalComissoes = comissoesAbertas.reduce((s, c) => s + c.valor, 0)

  const receitas = 156240
  const despesas = 120677
  const resultado = receitas - despesas
  const previsto = 32000
  const pctMeta = Math.round((resultado / 42000) * 100)

  return (
    <div>
      <PageHeader
        breadcrumb="Financeiro"
        title="Financeiro"
        description="Contas a pagar e receber, comissões e fluxo de caixa."
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="A receber (aberto)" value={formatBRL(stats.aReceber || 118883)} icon={TrendingUp} delta="+12%" deltaNote="vs mês anterior" />
        <StatCard label="A pagar (aberto)" value={formatBRL(stats.aPagar || 83320)} icon={TrendingDown} tone="danger" delta="-8%" deltaNote="vs mês anterior" deltaDirection="down" />
        <StatCard label="Comissões a pagar" value={formatBRL(stats.comissoesPend || 13415)} icon={Percent} delta="+5%" deltaNote="vs mês anterior" />
        <StatCard label="Fluxo de caixa (mês)" value={formatBRL(stats.fluxo || 35563)} icon={Landmark} tone="success" delta="+18%" deltaNote="vs mês anterior" />
      </div>

      <Card className="mt-6">
        <CardHeader className="pb-3">
          <span className="font-semibold">Ações rápidas</span>
        </CardHeader>
        <CardContent>
          <div className="flex flex-nowrap gap-3 overflow-x-auto pb-1">
            {ACOES_RAPIDAS.map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                className="flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
                onClick={() => {
                  if (label === 'Nova receita') openTitulo('receber')
                  else if (label === 'Nova despesa') openTitulo('pagar')
                  else if (label === 'Transferência') setTransfOpen(true)
                  else if (label === 'Exportar relatório') { exportarCsv(); toast.success('Relatório exportado.') }
                  else if (label === 'Conciliar contas') toast.success('Conciliação iniciada — verifique as abas A receber e A pagar.')
                  else if (label === 'Configurações') navigate('/adm')
                }}
              >
                <Icon className={`size-4 ${color}`} />
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <span className="font-semibold">Resumo do mês</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => navigate('/bi')}>
              Ver relatório completo <ArrowRight className="size-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <div className="flex-1 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Receitas</span>
                <span className="font-semibold text-[var(--status-success)] tabular-nums">{formatBRL(receitas)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Despesas</span>
                <span className="font-semibold text-[var(--status-danger)] tabular-nums">{formatBRL(despesas)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Resultado</span>
                <span className="font-semibold tabular-nums">{formatBRL(resultado)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Previsto</span>
                <span className="tabular-nums">{formatBRL(previsto)}</span>
              </div>
            </div>
            <DonutChart pct={pctMeta} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <span className="font-semibold">Contas bancárias</span>
          </CardHeader>
          <CardContent className="space-y-3">
            {contas.map((c) => (
              <div key={c.banco} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{c.banco}</p>
                  <p className="text-xs text-muted-foreground">{c.agencia}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium tabular-nums">{formatBRL(c.saldo)}</span>
                  <StatusBadge tone="success">Ativa</StatusBadge>
                </div>
              </div>
            ))}
            <div className="flex justify-between border-t pt-2 text-sm font-semibold">
              <span>Saldo total</span>
              <span className="tabular-nums">{formatBRL(totalContas)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_300px]">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
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
          <TabsContent value="receber" className="mt-4">
            <TitulosTab tipo="receber" />
          </TabsContent>
          <TabsContent value="pagar" className="mt-4">
            <TitulosTab tipo="pagar" />
          </TabsContent>
          <TabsContent value="comissoes" className="mt-4">
            <ComissoesTab />
          </TabsContent>
          <TabsContent value="fluxo" className="mt-4">
            <FluxoTab />
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <span className="text-sm font-semibold">Próximos vencimentos</span>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setActiveTab('receber')}>
                Ver todas <ArrowRight className="size-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {proximosVencimentos.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum título pendente.</p>
              ) : proximosVencimentos.map((v) => (
                <div key={v.id} className="flex items-start justify-between gap-2 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium leading-tight">{v.descricao}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(v.vencimento)}</p>
                  </div>
                  <span className="shrink-0 font-semibold tabular-nums">{formatBRL(v.valor)}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <span className="text-sm font-semibold">Comissões em aberto</span>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setActiveTab('comissoes')}>
                Ver todas <ArrowRight className="size-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>Beneficiário</span>
                <span>Valor</span>
              </div>
              {comissoesAbertas.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma comissão em aberto.</p>
              ) : comissoesAbertas.map((c) => (
                <div key={c.id} className="flex justify-between text-sm">
                  <span>{c.beneficiario}</span>
                  <span className="font-medium tabular-nums">{formatBRL(c.valor)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t pt-2 text-sm font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{formatBRL(totalComissoes)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <NovoTituloDialog open={tituloOpen} onOpenChange={setTituloOpen} tipo={tituloTipo} />

      <Dialog open={transfOpen} onOpenChange={setTransfOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Transferência entre contas</DialogTitle>
            <DialogDescription>Mova saldo entre suas contas bancárias.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>De</Label>
              <Select value={transfDe} onValueChange={setTransfDe}>
                <SelectTrigger><SelectValue placeholder="Conta de origem" /></SelectTrigger>
                <SelectContent>
                  {contas.map((c) => <SelectItem key={c.banco} value={c.banco}>{c.banco} ({formatBRL(c.saldo)})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Para</Label>
              <Select value={transfPara} onValueChange={setTransfPara}>
                <SelectTrigger><SelectValue placeholder="Conta de destino" /></SelectTrigger>
                <SelectContent>
                  {contas.map((c) => <SelectItem key={c.banco} value={c.banco}>{c.banco}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Valor (R$)</Label>
              <Input
                type="number" min={0} step={100}
                value={transfValor || ''}
                onChange={(e) => setTransfValor(e.target.valueAsNumber || 0)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={confirmarTransferencia}>Transferir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function FinanceiroPage() {
  return (
    <FinanceiroProvider>
      <FinanceiroContent />
    </FinanceiroProvider>
  )
}
