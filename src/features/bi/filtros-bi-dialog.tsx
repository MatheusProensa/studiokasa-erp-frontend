import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const METRICAS = ['Todas', 'Conversão', 'Ticket médio', 'Margem média', 'Inadimplência']
const VENDEDORES = ['Todos', 'Carlos Dias', 'Marina Alves', 'Rui Pena', 'Luiza Antunes']
const CANAIS = ['Todos', 'Instagram', 'Google', 'Meta Ads', 'E-mail', 'Indicação']

export interface BiFiltros {
  metrica: string
  vendedor: string
  canal: string
}

export const DEFAULT_BI_FILTROS: BiFiltros = { metrica: 'Todas', vendedor: 'Todos', canal: 'Todos' }

export function FiltrosBiDialog({ open, onOpenChange, value, onApply }: {
  open: boolean
  onOpenChange: (o: boolean) => void
  value: BiFiltros
  onApply: (f: BiFiltros) => void
}) {
  const [filtros, setFiltros] = useState<BiFiltros>(value)

  useEffect(() => { if (open) setFiltros(value) }, [open, value])

  function aplicar() {
    onApply(filtros)
    const partes = [
      filtros.metrica !== 'Todas' ? filtros.metrica : null,
      filtros.vendedor !== 'Todos' ? filtros.vendedor : null,
      filtros.canal !== 'Todos' ? `Origem: ${filtros.canal}` : null,
    ].filter(Boolean)
    toast.success(partes.length ? `Filtros aplicados: ${partes.join(' · ')}` : 'Filtros limpos — exibindo todos os dados.')
    onOpenChange(false)
  }

  function limpar() {
    setFiltros(DEFAULT_BI_FILTROS)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filtros do Dashboard</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Destacar métrica</Label>
            <Select value={filtros.metrica} onValueChange={(v) => setFiltros((f) => ({ ...f, metrica: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{METRICAS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Vendedor</Label>
            <Select value={filtros.vendedor} onValueChange={(v) => setFiltros((f) => ({ ...f, vendedor: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{VENDEDORES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Canal de origem</Label>
            <Select value={filtros.canal} onValueChange={(v) => setFiltros((f) => ({ ...f, canal: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CANAIS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={limpar}>Limpar filtros</Button>
          <Button onClick={aplicar}>Aplicar filtros</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
