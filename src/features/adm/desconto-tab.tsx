import { useState } from 'react'
import { Save } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/** Alçada de desconto por papel — espelha lib/permissions (Política do Módulo 0). */
const INICIAL = [
  { papel: 'Vendedor', limite: 5 },
  { papel: 'Supervisor', limite: 10 },
  { papel: 'Gerente', limite: 20 },
  { papel: 'Diretor(a)', limite: 100 },
]

export function DescontoTab() {
  const [regras, setRegras] = useState(INICIAL)

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Alçada de desconto por papel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {regras.map((r, i) => (
          <div key={r.papel} className="flex items-center justify-between gap-4">
            <Label className="text-sm">{r.papel}</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                max={100}
                className="w-24 text-right"
                value={r.limite}
                onChange={(e) =>
                  setRegras((prev) =>
                    prev.map((x, xi) => (xi === i ? { ...x, limite: e.target.valueAsNumber || 0 } : x)),
                  )
                }
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </div>
        ))}
        <div className="border-t pt-4">
          <Button onClick={() => toast.success('Política de desconto salva.')}>
            <Save className="size-4" /> Salvar política
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
