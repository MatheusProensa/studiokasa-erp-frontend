import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'

interface Imposto {
  sigla: string
  descricao: string
  aliquota: string
  vigencia: string
  reforma?: boolean
}

const IMPOSTOS: Imposto[] = [
  { sigla: 'ICMS', descricao: 'Imposto estadual (inclui montagem na base)', aliquota: '18%', vigencia: 'Vigente' },
  { sigla: 'PIS', descricao: 'Contribuição federal', aliquota: '0,65%', vigencia: 'Vigente' },
  { sigla: 'COFINS', descricao: 'Contribuição federal', aliquota: '3%', vigencia: 'Vigente' },
  { sigla: 'IPI', descricao: 'Apenas lido na NF-e de entrada do fornecedor', aliquota: '—', vigencia: 'Entrada' },
  { sigla: 'IBS', descricao: 'Imposto sobre Bens e Serviços (Reforma)', aliquota: 'a partir de 03/08/2026', vigencia: '2026–2033', reforma: true },
  { sigla: 'CBS', descricao: 'Contribuição sobre Bens e Serviços (Reforma)', aliquota: 'a partir de 03/08/2026', vigencia: '2026–2033', reforma: true },
]

export function FiscalTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Parâmetros fiscais</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-2.5 font-semibold">Tributo</th>
                <th className="px-6 py-2.5 font-semibold">Descrição</th>
                <th className="px-6 py-2.5 font-semibold">Alíquota</th>
                <th className="px-6 py-2.5 font-semibold">Vigência</th>
              </tr>
            </thead>
            <tbody>
              {IMPOSTOS.map((imp) => (
                <tr key={imp.sigla} className="border-b last:border-0">
                  <td className="px-6 py-3">
                    <span className="flex items-center gap-2 font-medium">
                      {imp.sigla}
                      {imp.reforma && <Badge variant="secondary">Reforma</Badge>}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">{imp.descricao}</td>
                  <td className="px-6 py-3 tabular-nums">{imp.aliquota}</td>
                  <td className="px-6 py-3">
                    <StatusBadge tone={imp.reforma ? 'warning' : 'info'}>{imp.vigencia}</StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Emissão</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Modelo padrão</span>
            <span className="font-medium">NF-e 55</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Regime tributário</span>
            <span className="font-medium">Simples Nacional</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Convivência de regimes</span>
            <span className="font-medium">2026–2033 (Reforma)</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
