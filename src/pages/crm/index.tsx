import { UserPlus, Handshake, Target, Filter, Plus, Search } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/patterns/stat-card'
import { StatusBadge } from '@/components/ui/status-badge'
import { NameAvatar } from '@/components/ui/name-avatar'
import { DEALS } from '@/features/crm/mock-data'

export default function CrmPage() {
  return (
    <div>
      <PageHeader
        breadcrumb="Comercial · CRM e Vendas"
        title="CRM e Vendas"
        description="Funil de oportunidades e negociações."
        actions={
          <>
            <Button variant="outline">
              <Filter className="size-4" />
              Filtros
            </Button>
            <Button>
              <Plus className="size-4" />
              Novo lead
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Leads abertos" value="38" icon={UserPlus} delta="+6" deltaNote="esta semana" />
        <StatCard label="Em negociação" value="R$ 312.400" icon={Handshake} />
        <StatCard label="Taxa de fechamento" value="34%" icon={Target} delta="+5%" deltaNote="vs. trimestre" />
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Oportunidades</CardTitle>
            <CardDescription>{DEALS.length} negociações ativas</CardDescription>
          </div>
          <div className="relative hidden max-w-xs flex-1 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar cliente..." className="pl-9" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-2.5 font-semibold">Cliente</th>
                <th className="px-6 py-2.5 font-semibold">Origem</th>
                <th className="px-6 py-2.5 font-semibold">Etapa</th>
                <th className="px-6 py-2.5 text-right font-semibold">Valor</th>
                <th className="px-6 py-2.5 font-semibold">Vendedor</th>
              </tr>
            </thead>
            <tbody>
              {DEALS.map((d) => (
                <tr key={d.nome} className="border-b last:border-0 transition-colors hover:bg-accent/50">
                  <td className="px-6 py-3 font-medium">{d.nome}</td>
                  <td className="px-6 py-3">
                    <Badge variant="secondary">{d.origem}</Badge>
                  </td>
                  <td className="px-6 py-3">
                    <StatusBadge tone={d.etapa.tone}>{d.etapa.label}</StatusBadge>
                  </td>
                  <td className="px-6 py-3 text-right tabular-nums">{d.valor}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <NameAvatar name={d.vendedor} size="sm" />
                      {d.vendedor}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
