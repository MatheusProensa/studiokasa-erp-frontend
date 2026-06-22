import { useState } from 'react'
import { Upload, FileText, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { usePedidos } from './pedidos-context'

export function ImportarPedidosDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { criarPedido } = usePedidos()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null)
  }

  function handleImport() {
    if (!file) return
    setLoading(true)
    setTimeout(() => {
      criarPedido({ projeto: 'PRJ-0048', ambiente: 'Painel TV sala', fornecedor: 'Marcenaria Dália', prazoEntrega: new Date(Date.now() + 12 * 86400000).toISOString().slice(0, 10), valor: 14200 })
      criarPedido({ projeto: 'PRJ-0049', ambiente: 'Bancada cozinha', fornecedor: 'Componentes RS', prazoEntrega: new Date(Date.now() + 18 * 86400000).toISOString().slice(0, 10), valor: 9800 })
      setLoading(false)
      toast.success(`${file.name} importado — 2 pedidos adicionados.`)
      setFile(null)
      onOpenChange(false)
    }, 1200)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!loading) { setFile(null); onOpenChange(o) } }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Importar Pedidos</DialogTitle>
          <DialogDescription>Importe pedidos a partir de um arquivo CSV ou XLSX.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer hover:bg-accent transition-colors">
            {file ? (
              <>
                <CheckCircle2 className="size-8 text-[var(--status-success)]" />
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
              </>
            ) : (
              <>
                <Upload className="size-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground text-center">
                  Clique para selecionar ou arraste<br />o arquivo CSV / XLSX
                </span>
              </>
            )}
            <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFile} />
          </label>

          <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground flex items-center gap-1"><FileText className="size-3" /> Colunas esperadas:</p>
            <p>fornecedor, item, qtd, valor_unitario, prazo_entrega</p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => { setFile(null); onOpenChange(false) }}>Cancelar</Button>
          <Button onClick={handleImport} disabled={!file || loading}>
            {loading ? 'Importando...' : 'Importar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
