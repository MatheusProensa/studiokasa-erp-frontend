import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { STAGES, ORIGENS } from './constants'

const VENDEDORES = ['Todos', 'Marina Alves', 'Carlos Dias', 'Rui Pena']

export interface CrmFiltros {
  etapa: string
  vendedor: string
  origem: string
}

export const DEFAULT_CRM_FILTROS: CrmFiltros = { etapa: 'Todas', vendedor: 'Todos', origem: 'Todas' }

export function FiltrosCrmDialog({ open, onOpenChange, value, onApply }: {
  open: boolean
  onOpenChange: (o: boolean) => void
  value: CrmFiltros
  onApply: (f: CrmFiltros) => void
}) {
  const [filtros, setFiltros] = useState<CrmFiltros>(value)

  useEffect(() => { if (open) setFiltros(value) }, [open, value])

  function aplicar() {
    onApply(filtros)
    const partes = [
      filtros.etapa !== 'Todas' ? filtros.etapa : null,
      filtros.vendedor !== 'Todos' ? filtros.vendedor : null,
      filtros.origem !== 'Todas' ? `Origem: ${filtros.origem}` : null,
    ].filter(Boolean)
    toast.success(partes.length ? `Filtro aplicado: ${partes.join(' · ')}` : 'Filtros limpos — exibindo tudo.')
    onOpenChange(false)
  }

  function limpar() {
    setFiltros(DEFAULT_CRM_FILTROS)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filtros — CRM e Vendas</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Etapa do funil</Label>
            <Select value={filtros.etapa} onValueChange={(v) => setFiltros((f) => ({ ...f, etapa: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas</SelectItem>
                {STAGES.map((s) => <SelectItem key={s.key} value={s.label}>{s.label}</SelectItem>)}
              </SelectContent>
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
            <Label>Origem do lead</Label>
            <Select value={filtros.origem} onValueChange={(v) => setFiltros((f) => ({ ...f, origem: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas</SelectItem>
                {ORIGENS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={limpar}>Limpar</Button>
          <Button onClick={aplicar}>Aplicar filtros</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
