import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatBRL } from '@/lib/format'
import { useFinanceiro } from './financeiro-context'

export function FluxoTab() {
  const { titulos } = useFinanceiro()

  const f = useMemo(() => {
    const sum = (tipo: 'pagar' | 'receber', pago: boolean) =>
      titulos
        .filter((t) => t.tipo === tipo && (t.status === 'pago') === pago)
        .reduce((s, t) => s + t.valor, 0)

    const entradasReal = sum('receber', true)
    const entradasPrev = sum('receber', false)
    const saidasReal = sum('pagar', true)
    const saidasPrev = sum('pagar', false)
    return {
      entradasReal,
      entradasPrev,
      saidasReal,
      saidasPrev,
      saldoReal: entradasReal - saidasReal,
      saldoProj: entradasReal + entradasPrev - (saidasReal + saidasPrev),
    }
  }, [titulos])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-[var(--status-success)]">Entradas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Linha label="Realizado" valor={f.entradasReal} />
            <Linha label="Previsto" valor={f.entradasPrev} muted />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-[var(--status-danger)]">Saídas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Linha label="Realizado" valor={f.saidasReal} />
            <Linha label="Previsto" valor={f.saidasPrev} muted />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Saldo realizado</p>
            <p className={`mt-1 text-2xl font-bold tabular-nums ${f.saldoReal < 0 ? 'text-[var(--status-danger)]' : ''}`}>
              {formatBRL(f.saldoReal)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Saldo projetado</p>
            <p className={`mt-1 text-2xl font-bold tabular-nums ${f.saldoProj < 0 ? 'text-[var(--status-danger)]' : ''}`}>
              {formatBRL(f.saldoProj)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Linha({ label, valor, muted }: { label: string; valor: number; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? 'text-muted-foreground' : ''}>{label}</span>
      <span className="tabular-nums font-semibold">{formatBRL(valor)}</span>
    </div>
  )
}
