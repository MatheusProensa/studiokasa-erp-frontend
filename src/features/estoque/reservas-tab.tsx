import { useMemo, useState } from 'react'
import { Lock, Unlock } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEstoque } from './estoque-context'

export function ReservasTab() {
  const { itens, alterarStatusItem } = useEstoque()
  const [open, setOpen] = useState(false)
  const [sku, setSku] = useState('')

  const reservados = useMemo(() => itens.filter((i) => i.status === 'reservado'), [itens])
  const disponiveis = useMemo(() => itens.filter((i) => i.status === 'disponivel'), [itens])

  function reservar() {
    if (!sku) {
      toast.error('Selecione um item.')
      return
    }
    alterarStatusItem(sku, 'reservado')
    toast.success('Item reservado com sucesso.')
    setSku('')
    setOpen(false)
  }

  function liberar(itemSku: string, nome: string) {
    alterarStatusItem(itemSku, 'disponivel')
    toast.success(`Reserva de "${nome}" liberada.`)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>
          <Lock className="size-4" /> Nova reserva
        </Button>
      </div>

      {reservados.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
          Nenhum item reservado no momento.
        </div>
      ) : (
        <div className="space-y-2">
          {reservados.map((i) => (
            <div key={i.sku} className="flex items-center justify-between rounded-lg border p-3 text-sm">
              <div>
                <p className="font-medium">{i.nome}</p>
                <p className="text-xs text-muted-foreground">{i.sku} · {i.endereco} · Lote {i.lote}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge tone="warning">Reservado</StatusBadge>
                <Button size="sm" variant="outline" onClick={() => liberar(i.sku, i.nome)}>
                  <Unlock className="size-4" /> Liberar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Nova reserva</DialogTitle>
            <DialogDescription>Reserve um item disponível para um projeto ou pedido.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label>Item</Label>
            <Select value={sku} onValueChange={setSku}>
              <SelectTrigger><SelectValue placeholder="Selecione um item disponível" /></SelectTrigger>
              <SelectContent>
                {disponiveis.map((i) => (
                  <SelectItem key={i.sku} value={i.sku}>{i.nome} ({i.saldo} un.)</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={reservar}>Reservar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
