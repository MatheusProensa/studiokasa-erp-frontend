import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  FolderKanban, Users, Wallet, Package, Truck, ClipboardList,
  FileText, Headset, Megaphone, Tag, BarChart3,
} from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export interface Atalho {
  icon: LucideIcon
  label: string
  color: string
  rota: string
}

const ROTAS: { label: string; value: string; icon: LucideIcon; color: string }[] = [
  { label: 'Projetos', value: '/projetos', icon: FolderKanban, color: 'text-primary' },
  { label: 'CRM e Vendas', value: '/crm', icon: Users, color: 'text-sky-600' },
  { label: 'Financeiro', value: '/financeiro', icon: Wallet, color: 'text-emerald-600' },
  { label: 'Estoque', value: '/estoque', icon: Package, color: 'text-violet-600' },
  { label: 'Logística', value: '/logistica', icon: Truck, color: 'text-amber-600' },
  { label: 'Pedidos', value: '/pedidos', icon: ClipboardList, color: 'text-rose-600' },
  { label: 'RH e Pessoas', value: '/rh', icon: Users, color: 'text-indigo-600' },
  { label: 'Fiscal', value: '/fiscal', icon: FileText, color: 'text-slate-600' },
  { label: 'Pós-venda', value: '/posvenda', icon: Headset, color: 'text-cyan-600' },
  { label: 'Marketing', value: '/marketing', icon: Megaphone, color: 'text-pink-600' },
  { label: 'Medição', value: '/medicao', icon: Tag, color: 'text-orange-600' },
  { label: 'BI e Dashboards', value: '/bi', icon: BarChart3, color: 'text-blue-600' },
]

export function NovoAtalhoDialog({ open, onOpenChange, onAdded }: {
  open: boolean
  onOpenChange: (o: boolean) => void
  onAdded: (atalho: Atalho) => void
}) {
  const [label, setLabel] = useState('')
  const [rota, setRota] = useState('')

  function salvar() {
    if (!label.trim() || !rota) {
      toast.error('Preencha o nome e selecione o destino.')
      return
    }
    const info = ROTAS.find((r) => r.value === rota)!
    onAdded({ icon: info.icon, label: label.trim(), color: info.color, rota })
    toast.success(`Atalho "${label}" adicionado ao dashboard.`)
    setLabel('')
    setRota('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Novo atalho</DialogTitle>
          <DialogDescription>Adicione um acesso rápido ao seu dashboard.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Nome do atalho</Label>
            <Input
              placeholder="Ex.: Nova venda"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Destino</Label>
            <Select value={rota} onValueChange={setRota}>
              <SelectTrigger><SelectValue placeholder="Selecione uma página…" /></SelectTrigger>
              <SelectContent>
                {ROTAS.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={salvar}>Adicionar atalho</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
