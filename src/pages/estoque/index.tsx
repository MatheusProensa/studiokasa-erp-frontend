import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Boxes, Package, ArrowLeftRight, AlertTriangle, ClipboardList, Bell,
  Download, Upload, Tag, BookOpen, ArrowRight, Clock, PackageCheck,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/patterns/stat-card'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { EstoqueProvider, useEstoque } from '@/features/estoque/estoque-context'
import { MovimentoDialog } from '@/features/estoque/movimento-dialog'
import { ItensTab } from '@/features/estoque/itens-tab'
import { KardexTab } from '@/features/estoque/kardex-tab'
import { InventarioTab } from '@/features/estoque/inventario-tab'
import { AlertasTab } from '@/features/estoque/alertas-tab'
import { ReservasTab } from '@/features/estoque/reservas-tab'
import { TransferenciasTab } from '@/features/estoque/transferencias-tab'
import { LotesTab } from '@/features/estoque/lotes-tab'
import { EtiquetasTab } from '@/features/estoque/etiquetas-tab'
import { itemNivel } from '@/features/estoque/level'

const ALERTAS_CRITICOS = [
  { icon: AlertTriangle, iconColor: 'text-red-500', label: '4 itens abaixo do mínimo', sub: 'Risco de ruptura' },
  { icon: Clock, iconColor: 'text-amber-500', label: '2 produtos parados', sub: 'Sem giro há 90+ dias' },
  { icon: ClipboardList, iconColor: 'text-amber-500', label: '1 divergência de inventário', sub: 'Contagem ≠ Sistema' },
  { icon: Boxes, iconColor: 'text-sky-500', label: '1 pedido para separar', sub: 'Para logística' },
]

const ATALHOS = [
  { icon: Download, label: 'Entrada de produto', color: 'text-emerald-600' },
  { icon: Upload, label: 'Saída / Baixa', color: 'text-red-500' },
  { icon: ArrowLeftRight, label: 'Transferência', color: 'text-sky-600' },
  { icon: ClipboardList, label: 'Inventário', color: 'text-violet-600' },
  { icon: BookOpen, label: 'Reservas', color: 'text-amber-600' },
  { icon: Tag, label: 'Etiquetas', color: 'text-slate-500' },
]

const PROXIMOS_RECEBIMENTOS = [
  { pedido: 'Pedido 1024', fornecedor: 'Ferragens Sul', item: 'Corrediça telescópica 450mm', statusLabel: 'Em trânsito', tone: 'info' as const, data: '24/06/2026' },
  { pedido: 'Pedido 1023', fornecedor: 'MDF Sul', item: 'Chapas MDF Branco TX 18mm', statusLabel: 'Em trânsito', tone: 'info' as const, data: '25/06/2026' },
]

const PEDIDOS_SEPARAR = [
  { pedido: 'Pedido 2501', projeto: 'Projeto PRJ-0042', itens: 7, statusLabel: 'Aguardando', tone: 'warning' as const, data: '20/06/2026' },
  { pedido: 'Pedido 2498', projeto: 'Projeto PRJ-0039', itens: 3, statusLabel: 'Aguardando', tone: 'warning' as const, data: '19/06/2026' },
]

const INVENTARIOS_ABERTO = [
  { codigo: 'Inventário 015', local: 'Filial 01 · Almoxarifado', statusLabel: 'Em andamento', tone: 'info' as const, data: '18/06/2026' },
]

function contarAlertas(itens: ReturnType<typeof useEstoque>['itens']) {
  return itens.filter((i) => ['zerado', 'critico', 'atencao'].includes(itemNivel(i))).length
}

function EstoqueContent() {
  const { itens, movimentos } = useEstoque()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('itens')
  const [movOpen, setMovOpen] = useState(false)
  const [movTipo, setMovTipo] = useState<'entrada' | 'saida' | 'transferencia' | 'ajuste'>('entrada')
  const [movRef, setMovRef] = useState<string | undefined>(undefined)

  const pedidoPendente = params.get('pedido')
  const fornecedorPendente = params.get('fornecedor')

  function openMov(tipo: typeof movTipo, ref?: string) {
    setMovTipo(tipo)
    setMovRef(ref)
    setMovOpen(true)
  }

  function registrarEntradaPedido() {
    openMov('entrada', pedidoPendente ?? undefined)
  }

  const stats = useMemo(() => {
    const skus = itens.length
    const baixoMinimo = itens.filter((i) => i.minimo > 0 && i.saldo < i.minimo).length
    const movs = movimentos.length
    return { skus, baixoMinimo, movs }
  }, [itens, movimentos])

  const nAlertas = contarAlertas(itens)

  return (
    <div>
      <PageHeader
        breadcrumb="Operações · Estoque e WMS"
        title="Estoque e Almoxarifado"
        description="Saldo, endereçamento, movimentações e inventário."
      />

      {pedidoPendente && (
        <Card className="border-[var(--status-success)]/40 bg-[var(--status-success-soft)]">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5">
            <div>
              <p className="text-sm font-medium">
                Pedido {pedidoPendente} recebido{fornecedorPendente ? ` de ${fornecedorPendente}` : ''} — pronto para entrada no estoque.
              </p>
              <p className="text-xs text-muted-foreground">Registre a movimentação de entrada para atualizar o saldo.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={registrarEntradaPedido}>
                <PackageCheck className="size-4" /> Registrar entrada
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setParams({})}>Dispensar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="SKUs em estoque" value={String(stats.skus)} icon={Package} delta="+12%" deltaNote="vs mês anterior" />
        <StatCard label="Abaixo do mínimo" value={String(stats.baixoMinimo)} icon={AlertTriangle} tone="danger" delta="+2" deltaNote="vs mês anterior" />
        <StatCard label="Movimentações (30 dias)" value={String(stats.movs)} icon={ArrowLeftRight} delta="+26%" deltaNote="vs mês anterior" />
      </div>

      <Card className="mt-6">
        <CardHeader className="pb-3">
          <span className="font-semibold">Ações rápidas</span>
        </CardHeader>
        <CardContent>
          <div className="flex flex-nowrap gap-3 overflow-x-auto pb-1">
            {ATALHOS.map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                className="flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
                onClick={() => {
                  if (label === 'Entrada de produto') openMov('entrada')
                  else if (label === 'Saída / Baixa') openMov('saida')
                  else if (label === 'Transferência') openMov('transferencia')
                  else if (label === 'Inventário') setActiveTab('inventario')
                  else if (label === 'Reservas') setActiveTab('reservas')
                  else if (label === 'Etiquetas') setActiveTab('etiquetas')
                }}
              >
                <Icon className={`size-4 ${color}`} />
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Alertas críticos</span>
              <span className="flex size-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">
                {nAlertas || ALERTAS_CRITICOS.length}
              </span>
            </div>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setActiveTab('alertas')}>
              Ver todos <ArrowRight className="size-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {ALERTAS_CRITICOS.map((a, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                  <a.icon className={`mt-0.5 size-5 shrink-0 ${a.iconColor}`} />
                  <div>
                    <p className="text-sm font-semibold">{a.label}</p>
                    <p className="text-xs text-muted-foreground">{a.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="itens">
              <Boxes className="size-4" />
              Itens
            </TabsTrigger>
            <TabsTrigger value="kardex">
              <ArrowLeftRight className="size-4" />
              Kardex
            </TabsTrigger>
            <TabsTrigger value="reservas">
              <BookOpen className="size-4" />
              Reservas
            </TabsTrigger>
            <TabsTrigger value="inventario">
              <ClipboardList className="size-4" />
              Inventário
            </TabsTrigger>
            <TabsTrigger value="transferencias">
              <ArrowLeftRight className="size-4" />
              Transferências
            </TabsTrigger>
            <TabsTrigger value="lotes">
              <Package className="size-4" />
              Lotes
            </TabsTrigger>
            <TabsTrigger value="etiquetas">
              <Tag className="size-4" />
              Etiquetas
            </TabsTrigger>
            <TabsTrigger value="alertas">
              <Bell className="size-4" />
              Alertas
            </TabsTrigger>
          </TabsList>
          <TabsContent value="itens" className="mt-4">
            <ItensTab />
          </TabsContent>
          <TabsContent value="kardex" className="mt-4">
            <KardexTab />
          </TabsContent>
          <TabsContent value="reservas" className="mt-4">
            <ReservasTab />
          </TabsContent>
          <TabsContent value="inventario" className="mt-4">
            <InventarioTab />
          </TabsContent>
          <TabsContent value="transferencias" className="mt-4">
            <TransferenciasTab />
          </TabsContent>
          <TabsContent value="lotes" className="mt-4">
            <LotesTab />
          </TabsContent>
          <TabsContent value="etiquetas" className="mt-4">
            <EtiquetasTab />
          </TabsContent>
          <TabsContent value="alertas" className="mt-4">
            <AlertasTab />
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <span className="text-sm font-semibold">Próximos recebimentos</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => navigate('/pedidos')}>
              Ver todos <ArrowRight className="size-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {PROXIMOS_RECEBIMENTOS.map((r) => (
              <div key={r.pedido} className="flex items-start justify-between gap-2 text-sm">
                <div>
                  <p className="font-medium">{r.pedido} · {r.fornecedor}</p>
                  <p className="text-xs text-muted-foreground">{r.item}</p>
                  <p className="text-xs text-muted-foreground">{r.data}</p>
                </div>
                <StatusBadge tone={r.tone}>{r.statusLabel}</StatusBadge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <span className="text-sm font-semibold">Pedidos para separar</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => navigate('/logistica')}>
              Ver todos <ArrowRight className="size-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {PEDIDOS_SEPARAR.map((p) => (
              <div key={p.pedido} className="flex items-start justify-between gap-2 text-sm">
                <div>
                  <p className="font-medium">{p.pedido} · {p.projeto}</p>
                  <p className="text-xs text-muted-foreground">Itens: {p.itens}</p>
                  <p className="text-xs text-muted-foreground">{p.data}</p>
                </div>
                <StatusBadge tone={p.tone}>{p.statusLabel}</StatusBadge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <span className="text-sm font-semibold">Inventários em aberto</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setActiveTab('inventario')}>
              Ver todos <ArrowRight className="size-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {INVENTARIOS_ABERTO.map((inv) => (
              <div key={inv.codigo} className="flex items-start justify-between gap-2 text-sm">
                <div>
                  <p className="font-medium">{inv.codigo}</p>
                  <p className="text-xs text-muted-foreground">{inv.local}</p>
                  <p className="text-xs text-muted-foreground">{inv.data}</p>
                </div>
                <StatusBadge tone={inv.tone}>{inv.statusLabel}</StatusBadge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <MovimentoDialog open={movOpen} onOpenChange={setMovOpen} tipoInicial={movTipo} refInicial={movRef} />
    </div>
  )
}

export default function EstoquePage() {
  return (
    <EstoqueProvider>
      <EstoqueContent />
    </EstoqueProvider>
  )
}
