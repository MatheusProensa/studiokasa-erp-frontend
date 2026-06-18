import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NPS } from './mock-data'

export function NpsTab() {
  const { score, respostas, promotores, neutros, detratores } = NPS
  const total = promotores + neutros + detratores
  const pct = (n: number) => Math.round((n / total) * 100)

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-base">NPS</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-1 py-6">
          <span className="text-5xl font-bold tabular-nums text-primary">{score}</span>
          <span className="text-sm text-muted-foreground">{respostas} respostas</span>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Distribuição</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 py-4">
          <Barra label="Promotores" valor={pct(promotores)} cor="var(--status-success)" />
          <Barra label="Neutros" valor={pct(neutros)} cor="var(--status-warning)" />
          <Barra label="Detratores" valor={pct(detratores)} cor="var(--status-danger)" />
        </CardContent>
      </Card>
    </div>
  )
}

function Barra({ label, valor, cor }: { label: string; valor: number; cor: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-semibold tabular-nums">{valor}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full" style={{ width: `${valor}%`, backgroundColor: cor }} />
      </div>
    </div>
  )
}
