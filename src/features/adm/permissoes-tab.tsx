import { useState } from 'react'
import { Save } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ROLE_OPTIONS } from '@/lib/roles'
import { NAV_ITEMS } from '@/lib/nav'
import type { AccessRole } from '@/types'

const ACOES = ['Ver', 'Criar', 'Editar', 'Excluir'] as const
const MODULOS = NAV_ITEMS.filter((i) => i.module >= 0)

type Matriz = Record<string, Record<string, boolean>>

function matrizInicial(): Matriz {
  const m: Matriz = {}
  for (const mod of MODULOS) {
    m[mod.href] = { Ver: true, Criar: false, Editar: false, Excluir: false }
  }
  return m
}

export function PermissoesTab() {
  const [papel, setPapel] = useState<AccessRole>('vendedor')
  const [matriz, setMatriz] = useState<Matriz>(matrizInicial)

  function toggle(href: string, acao: string) {
    setMatriz((prev) => ({ ...prev, [href]: { ...prev[href], [acao]: !prev[href][acao] } }))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
        <CardTitle>Permissões por papel</CardTitle>
        <div className="flex items-center gap-2">
          <Select value={papel} onValueChange={(v) => setPapel(v as AccessRole)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => toast.success('Permissões salvas.')}>
            <Save className="size-4" /> Salvar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-2.5 font-semibold">Módulo</th>
                {ACOES.map((a) => (
                  <th key={a} className="px-4 py-2.5 text-center font-semibold">
                    {a}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODULOS.map((mod) => (
                <tr key={mod.href} className="border-b last:border-0">
                  <td className="px-6 py-2.5 font-medium">{mod.label}</td>
                  {ACOES.map((a) => (
                    <td key={a} className="px-4 py-2.5 text-center">
                      <Checkbox
                        checked={matriz[mod.href][a]}
                        onCheckedChange={() => toggle(mod.href, a)}
                        aria-label={`${a} ${mod.label}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
