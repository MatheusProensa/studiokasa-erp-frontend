import { Percent, Receipt, TrendingUp, AlertCircle } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/patterns/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NameAvatar } from '@/components/ui/name-avatar'
import { formatBRL } from '@/lib/format'
import {
  VENDAS_MES,
  RANKING_VENDEDORES,
  CURVA_ABC,
  TERCEIRIZACAO,
  FINANCEIRO_BI,
} from '@/features/bi/mock-data'

const CLASSE_TONE = { A: 'var(--status-success)', B: 'var(--status-warning)', C: 'var(--status-neutral)' }

export default function BiPage() {
  const maxVenda = Math.max(...VENDAS_MES.map((v) => v.valor))
  const maxRank = Math.max(...RANKING_VENDEDORES.map((r) => r.valor))

  return (
    <div>
      <PageHeader
        breadcrumb="Geral · BI e Dashboards"
        title="BI e Dashboards"
        description="Indicadores gerenciais consolidados."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Conversão" value={`${FINANCEIRO_BI.conversao}%`} icon={Percent} />
        <StatCard label="Ticket médio" value={formatBRL(FINANCEIRO_BI.ticketMedio)} icon={Receipt} />
        <StatCard label="Margem média" value={`${FINANCEIRO_BI.margemMedia}%`} icon={TrendingUp} />
        <StatCard label="Inadimplência" value={`${FINANCEIRO_BI.inadimplencia}%`} icon={AlertCircle} deltaDirection="down" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Vendas por mês */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Vendas por mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-end justify-between gap-3">
              {VENDAS_MES.map((v) => (
                <div key={v.mes} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-md bg-primary transition-all"
                      style={{ height: `${(v.valor / maxVenda) * 100}%` }}
                      title={formatBRL(v.valor)}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{v.mes}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Terceirização */}
        <Card>
          <CardHeader>
            <CardTitle>Terceirização</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Linha label="Prazo médio fornecedor" valor={`${TERCEIRIZACAO.prazoMedioDias} dias`} />
            <Linha label="Pedidos no prazo" valor={`${TERCEIRIZACAO.pedidosNoPrazo}%`} />
            <Linha label="OTIF" valor={`${TERCEIRIZACAO.otif}%`} />
            <Linha label="Divergências" valor={String(TERCEIRIZACAO.divergencias)} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Ranking vendedores */}
        <Card>
          <CardHeader>
            <CardTitle>Ranking de vendedores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {RANKING_VENDEDORES.map((r) => (
              <div key={r.nome} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <NameAvatar name={r.nome} size="sm" />
                    {r.nome}
                  </span>
                  <span className="tabular-nums font-semibold">{formatBRL(r.valor)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-secondary" style={{ width: `${(r.valor / maxRank) * 100}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Curva ABC */}
        <Card>
          <CardHeader>
            <CardTitle>Curva ABC — clientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {CURVA_ABC.map((c) => (
              <div key={c.nome} className="flex items-center justify-between rounded-lg border p-2.5 text-sm">
                <span className="flex items-center gap-2">
                  <span
                    className="flex size-6 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: CLASSE_TONE[c.classe] }}
                  >
                    {c.classe}
                  </span>
                  {c.nome}
                </span>
                <span className="tabular-nums font-medium">{formatBRL(c.valor)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Linha({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold tabular-nums">{valor}</span>
    </div>
  )
}
