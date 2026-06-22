import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

export interface DashboardPrefs {
  layout: 'padrao' | 'compacto' | 'expandido'
  periodo: 'semana' | 'mes' | 'trimestre'
  mostrarFinanceiro: boolean
  mostrarAlertas: boolean
  mostrarAgenda: boolean
}

export const DEFAULT_PREFS: DashboardPrefs = {
  layout: 'padrao',
  periodo: 'mes',
  mostrarFinanceiro: true,
  mostrarAlertas: true,
  mostrarAgenda: true,
}

export function PersonalizarDashboardDialog({ open, onOpenChange, value, onSave }: {
  open: boolean
  onOpenChange: (o: boolean) => void
  value: DashboardPrefs
  onSave: (prefs: DashboardPrefs) => void
}) {
  const [prefs, setPrefs] = useState<DashboardPrefs>(value)

  useEffect(() => { if (open) setPrefs(value) }, [open, value])

  function salvar() {
    onSave(prefs)
    toast.success('Preferências do dashboard salvas.')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Personalizar Dashboard</DialogTitle>
          <DialogDescription>Escolha quais painéis e métricas exibir na tela inicial.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-2">
          <div className="grid gap-2">
            <Label>Layout</Label>
            <Select value={prefs.layout} onValueChange={(v: DashboardPrefs['layout']) => setPrefs((p) => ({ ...p, layout: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="padrao">Padrão (4 colunas)</SelectItem>
                <SelectItem value="compacto">Compacto (2 colunas)</SelectItem>
                <SelectItem value="expandido">Expandido (lista)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Período padrão dos KPIs</Label>
            <Select value={prefs.periodo} onValueChange={(v: DashboardPrefs['periodo']) => setPrefs((p) => ({ ...p, periodo: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="semana">Esta semana</SelectItem>
                <SelectItem value="mes">Este mês</SelectItem>
                <SelectItem value="trimestre">Este trimestre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3 border rounded-lg p-4">
            <p className="text-sm font-medium">Painéis visíveis</p>
            {[
              { key: 'mostrarFinanceiro' as const, label: 'Resumo financeiro' },
              { key: 'mostrarAlertas' as const, label: 'Alertas e pendências' },
              { key: 'mostrarAgenda' as const, label: 'Agenda da semana' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <Label className="text-sm font-normal">{label}</Label>
                <Switch checked={prefs[key]} onCheckedChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))} />
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={salvar}>Salvar preferências</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
