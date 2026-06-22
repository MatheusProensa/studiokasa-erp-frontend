import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Factory, AlarmClock, AlertTriangle, Download, Plus, ChevronDown,
  Copy, Upload, CalendarClock, Send, History, Settings2,
} from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PedidosProvider, usePedidos, estaAtrasado } from '@/features/pedidos/pedidos-context'
import { PedidosTable } from '@/features/pedidos/pedidos-table'
import { NovoPedidoDialog } from '@/features/pedidos/novo-pedido-dialog'
import { ImportarPedidosDialog } from '@/features/pedidos/importar-pedidos-dialog'

function exportarCsv(pedidos: ReturnType<typeof usePedidos>['pedidos']) {
  const header = ['Código', 'Projeto', 'Ambiente', 'Fornecedor', 'Status', 'Prazo', 'Valor']
  const linhas = pedidos.map((p) => [p.codigo, p.projeto, p.ambiente, p.fornecedor, p.status, p.prazoEntrega, p.valor])
  const csv = [header, ...linhas].map((l) => l.join(';')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'relatorio-pedidos.csv'
  a.click()
  URL.revokeObjectURL(url)
}

const SPARK_PROD = [1, 1, 2, 1, 2, 2, 1, 2, 2, 2]
const SPARK_ATRAS = [0, 1, 0, 1, 1, 0, 1, 1, 0, 1]
const SPARK_DIV = [0, 0, 1, 0, 1, 0, 0, 1, 0, 1]

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const w = 200; const h = 40
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 6) - 3
    return `${x},${y}`
  })
  const areaPath = `M${pts.join('L')}L${w},${h}L0,${h}Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-10 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`pg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#pg-${color.replace('#', '')})`} />
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="1.8" />
    </svg>
  )
}

function PedidosKpis() {
  const { pedidos } = usePedidos()
  const stats = useMemo(() => {
    const emProducao = pedidos.filter((p) => p.status === 'em-producao').length
    const atrasados = pedidos.filter((p) => estaAtrasado(p)).length
    const comDivergencia = pedidos.filter((p) => p.divergencias.length > 0).length
    return { emProducao, atrasados, comDivergencia }
  }, [pedidos])

  const cards = [
    { label: 'Em produção', value: stats.emProducao, delta: '+1 vs. mês anterior', icon: Factory, color: '#6366F1', spark: SPARK_PROD, iconBg: 'bg-indigo-50 text-indigo-600' },
    { label: 'Atrasados', value: stats.atrasados, delta: '↑ 1 vs. mês anterior', icon: AlarmClock, color: '#EF4444', spark: SPARK_ATRAS, iconBg: 'bg-rose-50 text-rose-600' },
    { label: 'Com divergência', value: stats.comDivergencia, delta: '↑ 1 vs. mês anterior', icon: AlertTriangle, color: '#F59E0B', spark: SPARK_DIV, iconBg: 'bg-amber-50 text-amber-600' },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map(({ label, value, delta, icon: Icon, color, spark, iconBg }) => (
        <Card key={label} className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                <Icon className="size-4" />
              </div>
            </div>
            <p className="mt-2 text-4xl font-bold">{value}</p>
            <p className="mt-1 text-xs font-medium text-[var(--status-success)]">{delta}</p>
            <div className="mt-3">
              <MiniSparkline data={spark} color={color} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const ACOES_RAPIDAS = [
  { icon: Copy, label: 'Duplicar pedido' },
  { icon: Upload, label: 'Importar pedidos' },
  { icon: CalendarClock, label: 'Agendar entrega' },
  { icon: Send, label: 'Enviar mensagem' },
  { icon: History, label: 'Histórico de pedidos' },
  { icon: Settings2, label: 'Configurações' },
]

function PedidosContent() {
  const [novoOpen, setNovoOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const { pedidos, criarPedido } = usePedidos()
  const navigate = useNavigate()

  function handleDuplicar() {
    const last = pedidos[0]
    if (!last) {
      toast.info('Nenhum pedido para duplicar.')
      return
    }
    criarPedido({ projeto: last.projeto, ambiente: `${last.ambiente} (cópia)`, fornecedor: last.fornecedor, prazoEntrega: last.prazoEntrega, valor: last.valor })
    toast.success(`Pedido "${last.codigo}" duplicado com sucesso.`)
  }

  function handleEnviarMensagem() {
    const pendente = pedidos.find((p) => p.status !== 'recebido')
    if (!pendente) {
      toast.info('Nenhum pedido em aberto para enviar mensagem.')
      return
    }
    toast.success(`Mensagem enviada para ${pendente.fornecedor} sobre o pedido ${pendente.codigo}.`)
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Operações · Pedido ao Fornecedor"
        title="Pedido ao Fornecedor"
        description="Acompanhamento de produção terceirizada e recebimento."
        actions={
          <>
            <Button variant="outline" onClick={() => exportarCsv(pedidos)}>
              <Download className="size-4" />
              Exportar relatório
            </Button>
            <Button onClick={() => setNovoOpen(true)}>
              <Plus className="size-4" />
              Novo pedido
              <ChevronDown className="size-4" />
            </Button>
          </>
        }
      />

      <PedidosKpis />

      <Card className="mt-6">
        <CardHeader className="pb-3">
          <span className="font-semibold">Ações rápidas</span>
        </CardHeader>
        <CardContent>
          <div className="flex flex-nowrap gap-3 overflow-x-auto pb-1">
            <button
              className="flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
              onClick={() => setNovoOpen(true)}
            >
              <Plus className="size-4 text-primary" />
              Novo pedido
            </button>
            {ACOES_RAPIDAS.map(({ icon: Icon, label }) => (
              <button
                key={label}
                className="flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
                onClick={() => {
                  if (label === 'Importar pedidos') setImportOpen(true)
                  else if (label === 'Duplicar pedido') handleDuplicar()
                  else if (label === 'Agendar entrega') navigate('/logistica')
                  else if (label === 'Enviar mensagem') handleEnviarMensagem()
                  else if (label === 'Histórico de pedidos') navigate('/bi')
                  else if (label === 'Configurações') navigate('/adm')
                }}
              >
                <Icon className="size-4 text-muted-foreground" />
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <PedidosTable />
      </div>

      <NovoPedidoDialog open={novoOpen} onOpenChange={setNovoOpen} />
      <ImportarPedidosDialog open={importOpen} onOpenChange={setImportOpen} />
    </div>
  )
}

export default function PedidosPage() {
  return (
    <PedidosProvider>
      <PedidosContent />
    </PedidosProvider>
  )
}
