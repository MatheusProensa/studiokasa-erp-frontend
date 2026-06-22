import { useState } from 'react'
import { Printer } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useEstoque } from './estoque-context'

export function EtiquetasTab() {
  const { itens } = useEstoque()
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set())

  function toggle(sku: string) {
    setSelecionados((prev) => {
      const next = new Set(prev)
      if (next.has(sku)) next.delete(sku)
      else next.add(sku)
      return next
    })
  }

  function imprimir() {
    if (selecionados.size === 0) {
      toast.error('Selecione ao menos um item.')
      return
    }
    const linhas = itens
      .filter((i) => selecionados.has(i.sku))
      .map((i) => `${i.sku} | ${i.nome} | Endereço: ${i.endereco} | Lote: ${i.lote}`)
    const conteudo = linhas.join('\n')
    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'etiquetas.txt'
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`${selecionados.size} etiqueta(s) geradas para impressão.`)
    setSelecionados(new Set())
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={imprimir} disabled={selecionados.size === 0}>
          <Printer className="size-4" /> Imprimir etiquetas selecionadas ({selecionados.size})
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="w-10 px-3 py-2"></th>
              <th className="px-3 py-2 font-semibold">SKU</th>
              <th className="px-3 py-2 font-semibold">Item</th>
              <th className="px-3 py-2 font-semibold">Endereço</th>
              <th className="px-3 py-2 font-semibold">Lote</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((i) => (
              <tr key={i.sku} className="border-t">
                <td className="px-3 py-2">
                  <Checkbox checked={selecionados.has(i.sku)} onCheckedChange={() => toggle(i.sku)} />
                </td>
                <td className="px-3 py-2 font-medium">{i.sku}</td>
                <td className="px-3 py-2">{i.nome}</td>
                <td className="px-3 py-2 text-muted-foreground">{i.endereco}</td>
                <td className="px-3 py-2 text-muted-foreground">{i.lote}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
