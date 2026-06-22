import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText, PackageSearch, History, Boxes, AlertTriangle, ShoppingCart,
  Truck, PackageCheck, ArrowRight, Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/patterns/stat-card'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { CotacoesTab } from '@/features/compras/cotacoes-tab'
import { SugestoesTab } from '@/features/compras/sugestoes-tab'
import { HistoricoTab } from '@/features/compras/historico-tab'
import { COTACOES as COTACOES_INICIAIS, SUGESTOES } from '@/features/compras/mock-data'
import type { Cotacao } from '@/features/compras/types'
import { formatBRL } from '@/lib/format'

const ACOES_PENDENTES = [
  { label: '2 cotações aguardando comparação', sub: 'Aguardando análise de propostas', count: 2, iconColor: 'text-sky-500', tone: 'info' as const },
  { label: '4 itens abaixo do mínimo', sub: 'Risco de ruptura de estoque', count: 4, iconColor: 'text-red-500', tone: 'danger' as const },
  { label: '1 pedido atrasado', sub: 'Fornecedor com prazo excedido', count: 1, iconColor: 'text-amber-500', tone: 'warning' as const },
  { label: '1 divergência NF × Pedido', sub: 'Aguardando conferrência', count: 1, iconColor: 'text-orange-500', tone: 'warning' as const },
]

const SUGESTOES_IA = [
  {
    nome: 'Corrediça telescópica 450mm',
    categoria: 'Acessório / ferragem',
    estoqueAtual: 12, minimo: 40, cobertura: '5 dias',
    coberturaRuim: true,
    fornecedor: 'Ferragens Sul', precoMedio: 8.9, prazoMedio: 3,
  },
  {
    nome: 'Dobradiça curva',
    categoria: 'Acessório / ferragem',
    estoqueAtual: 30, minimo: 100, cobertura: '7 dias',
    coberturaRuim: true,
    fornecedor: 'Aço & Cia', precoMedio: 2.4, prazoMedio: 2,
  },
  {
    nome: 'Puxador alumínio 600mm',
    categoria: 'Acessório / ferragem',
    estoqueAtual: 8, minimo: 20, cobertura: '4 dias',
    coberturaRuim: true,
    fornecedor: 'Inox Prime', precoMedio: 15.9, prazoMedio: 4,
  },
]

const PEDIDOS_TRANSITO = [
  { codigo: 'Pedido 3021', fornecedor: 'MDF Sul', statusLabel: 'Em transporte', tone: 'info' as const, previsao: '24/06/2026', valor: 3250 },
  { codigo: 'Pedido 3018', fornecedor: 'Ferragens Sul', statusLabel: 'Separado', tone: 'neutral' as const, previsao: '22/06/2026', valor: 1870 },
  { codigo: 'Pedido 3012', fornecedor: 'Aço & Cia', statusLabel: 'Em transporte', tone: 'info' as const, previsao: '25/06/2026', valor: 990 },
]

const RECEBIMENTOS_PENDENTES = [
  { nf: 'NF 45821', fornecedor: 'Ferragens Sul', statusLabel: 'Aguardando conferência', tone: 'warning' as const, data: '18/06/2026', valor: 1240 },
  { nf: 'NF 45819', fornecedor: 'MDF Sul', statusLabel: 'Aguardando conferência', tone: 'warning' as const, data: '18/06/2026', valor: 2310 },
  { nf: 'NF 45817', fornecedor: 'Inox Prime', statusLabel: 'Aguardando conferência', tone: 'warning' as const, data: '17/06/2026', valor: 680 },
]

const FORNECEDORES_DESTAQUE = [
  { nome: 'Ferragens Sul', precoMedio: 1245.5, prazo: 3, atraso: '2%', ratingLabel: 'Ótimo', ratingTone: 'success' as const },
  { nome: 'Aço & Cia', precoMedio: 2310, prazo: 4, atraso: '5%', ratingLabel: 'Bom', ratingTone: 'info' as const },
  { nome: 'MDF Sul', precoMedio: 2980.2, prazo: 6, atraso: '12%', ratingLabel: 'Atenção', ratingTone: 'warning' as const },
  { nome: 'Inox Prime', precoMedio: 1850, prazo: 4, atraso: '0%', ratingLabel: 'Ótimo', ratingTone: 'success' as const },
]

export default function ComprasPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('cotacoes')
  const [cotacoes, setCotacoes] = useState<Cotacao[]>(COTACOES_INICIAIS)
  const cotacoesAbertas = cotacoes.filter((c) => c.status === 'aberta').length
  const itensBaixo = SUGESTOES.length

  function adicionarCotacao(c: Cotacao) {
    setCotacoes((prev) => [c, ...prev])
  }

  function gerarCotacaoIA(item: typeof SUGESTOES_IA[number]) {
    adicionarCotacao({
      id: Date.now(),
      codigo: `COT-${3000 + Math.floor(Math.random() * 900)}`,
      descricao: item.nome,
      status: 'aberta',
      criadaEm: new Date().toISOString(),
      itens: [item.nome],
      propostas: [{ fornecedor: item.fornecedor, valorTotal: item.precoMedio * item.minimo, prazoDias: item.prazoMedio }],
    })
    toast.success(`Cotação gerada para "${item.nome}".`)
    setActiveTab('cotacoes')
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Operações · Compras e Suprimentos"
        title="Compras e Suprimentos"
        description="Cotações, sugestões de compra, pedidos e histórico de preços."
      />

      <div className="grid gap-4 sm:grid-cols-5">
        <StatCard label="Cotações abertas" value={String(cotacoesAbertas)} icon={ShoppingCart} delta="+0%" deltaNote="Ver cotações →" />
        <StatCard label="Itens abaixo do mínimo" value={String(itensBaixo)} icon={AlertTriangle} tone="danger" delta="+0%" deltaNote="Ver itens críticos →" />
        <StatCard label="Pedidos em trânsito" value="5" icon={Truck} delta="+0%" deltaNote="Acompanhar pedidos →" />
        <StatCard label="Recebimentos pendentes" value="3" icon={PackageCheck} delta="+0%" deltaNote="Conferir recebimentos →" />
        <StatCard label="Fornecedores ativos" value="4" icon={Boxes} delta="+0%" deltaNote="Ver fornecedores →" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <span className="font-semibold">Ações pendentes</span>
          </CardHeader>
          <CardContent className="space-y-3">
            {ACOES_PENDENTES.map((a) => (
              <div key={a.label} className="flex items-center gap-3">
                <AlertTriangle className={`size-4 shrink-0 ${a.iconColor}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.sub}</p>
                </div>
                <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                  {a.count}
                </span>
              </div>
            ))}
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setActiveTab('cotacoes')}>
              Ver todas as ações <ArrowRight className="size-3 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Sugestões de compra</span>
              <span className="flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                <Sparkles className="size-3" /> IA
              </span>
            </div>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setActiveTab('sugestoes')}>
              Ver todas <ArrowRight className="size-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {SUGESTOES_IA.map((s) => (
              <div key={s.nome} className="space-y-2 rounded-lg border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{s.nome}</p>
                    <p className="text-xs text-muted-foreground">{s.categoria}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Estoque atual</p>
                    <p className="font-medium">{s.estoqueAtual} un.</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Mínimo</p>
                    <p className="font-medium">{s.minimo} un.</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cobertura</p>
                    <p className={`font-semibold ${s.coberturaRuim ? 'text-red-500' : 'text-emerald-600'}`}>{s.cobertura}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-700 font-medium">Fornecedor recomendado</span>
                    <span className="ml-1.5 text-muted-foreground">{s.fornecedor}</span>
                    <span className="ml-2 text-muted-foreground">Preço médio {formatBRL(s.precoMedio)}</span>
                    <span className="ml-2 text-muted-foreground">Prazo médio {s.prazoMedio} dias</span>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs shrink-0" onClick={() => gerarCotacaoIA(s)}>Gerar cotação</Button>
                </div>
              </div>
            ))}
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setActiveTab('sugestoes')}>
              Ver mais sugestões <ArrowRight className="size-3 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <span className="font-semibold">Pedidos em trânsito</span>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => navigate('/logistica')}>
                Ver todos <ArrowRight className="size-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {PEDIDOS_TRANSITO.map((p) => (
                <div key={p.codigo} className="flex items-start justify-between gap-2 text-sm">
                  <div>
                    <p className="font-medium">{p.codigo}</p>
                    <p className="text-xs text-muted-foreground">{p.fornecedor}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <StatusBadge tone={p.tone}>{p.statusLabel}</StatusBadge>
                    <p className="mt-1 text-xs text-muted-foreground">Previsão {p.previsao}</p>
                    <p className="text-xs font-medium tabular-nums">{formatBRL(p.valor)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <span className="font-semibold">Recebimentos pendentes</span>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => navigate('/estoque')}>
                Ver todos <ArrowRight className="size-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {RECEBIMENTOS_PENDENTES.map((r) => (
                <div key={r.nf} className="flex items-start justify-between gap-2 text-sm">
                  <div>
                    <p className="font-medium">{r.nf}</p>
                    <p className="text-xs text-muted-foreground">{r.fornecedor}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <StatusBadge tone={r.tone}>{r.statusLabel}</StatusBadge>
                    <p className="mt-1 text-xs text-muted-foreground">Data {r.data}</p>
                    <p className="text-xs font-medium tabular-nums">{formatBRL(r.valor)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_300px]">
        <div>
          <h3 className="mb-4 text-base font-semibold">Cotações abertas</h3>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
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
            <TabsContent value="cotacoes" className="mt-4">
              <CotacoesTab cotacoes={cotacoes} onCotacoesChange={setCotacoes} />
            </TabsContent>
            <TabsContent value="sugestoes" className="mt-4">
              <SugestoesTab onCotacaoGerada={adicionarCotacao} />
            </TabsContent>
            <TabsContent value="historico" className="mt-4">
              <HistoricoTab />
            </TabsContent>
          </Tabs>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <span className="font-semibold">Fornecedores em destaque</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setActiveTab('historico')}>
              Ver todos <ArrowRight className="size-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-2 grid grid-cols-4 text-xs text-muted-foreground">
              <span>Fornecedor</span>
              <span className="text-right">Preço médio</span>
              <span className="text-right">Prazo</span>
              <span className="text-right">Rating</span>
            </div>
            <div className="space-y-2">
              {FORNECEDORES_DESTAQUE.map((f) => (
                <div key={f.nome} className="grid grid-cols-4 items-center text-sm">
                  <span className="font-medium">{f.nome}</span>
                  <span className="text-right tabular-nums">{formatBRL(f.precoMedio)}</span>
                  <span className="text-right text-muted-foreground">{f.prazo} dias</span>
                  <div className="flex justify-end">
                    <StatusBadge tone={f.ratingTone}>{f.ratingLabel}</StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
