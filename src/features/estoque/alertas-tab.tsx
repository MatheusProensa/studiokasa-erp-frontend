import { useMemo, useState } from 'react'
import { PackageX, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'
import { useEstoque } from './estoque-context'
import { itemNivel } from './level'
import { MovimentoDialog } from './movimento-dialog'
import type { EstoqueItem } from './types'

const SECOES = [
  { nivel: 'zerado', titulo: 'Zerados', icon: PackageX, cor: 'var(--status-danger)' },
  { nivel: 'critico', titulo: 'Críticos', icon: TrendingDown, cor: 'var(--status-danger)' },
  { nivel: 'atencao', titulo: 'Atenção', icon: AlertTriangle, cor: 'var(--status-warning)' },
] as const

export function AlertasTab() {
  const { itens } = useEstoque()
  const [mov, setMov] = useState(false)

  const grupos = useMemo(() => {
    const g: Record<string, EstoqueItem[]> = { zerado: [], critico: [], atencao: [] }
    for (const i of itens) {
      const n = itemNivel(i)
      if (n in g) g[n].push(i)
    }
    return g
  }, [itens])

  const total = grupos.zerado.length + grupos.critico.length + grupos.atencao.length

  if (total === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <CheckCircle2 className="size-9 text-[var(--status-success)]" />
          <p className="text-sm text-muted-foreground">Nenhum alerta — estoque saudável.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {SECOES.map((secao) => {
        const lista = grupos[secao.nivel]
        if (lista.length === 0) return null
        return (
          <div key={secao.nivel}>
            <div className="mb-2 flex items-center gap-2">
              <secao.icon className="size-4" style={{ color: secao.cor }} />
              <span className="text-sm font-semibold">{secao.titulo}</span>
              <Badge variant="secondary">{lista.length}</Badge>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {lista.map((i) => (
                <Card key={i.sku}>
                  <CardContent className="flex items-center justify-between gap-3 p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{i.nome}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" />
                        {i.endereco}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold tabular-nums" style={{ color: secao.cor }}>
                          {i.saldo}
                        </p>
                        <p className="text-[11px] text-muted-foreground">mín {i.minimo}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => setMov(true)}>
                        Repor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      })}
      <MovimentoDialog open={mov} onOpenChange={setMov} />
    </div>
  )
}
