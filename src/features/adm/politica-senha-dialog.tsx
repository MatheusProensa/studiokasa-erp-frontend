import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

export interface PoliticaSenha {
  tamanhoMinimo: number
  exigirNumero: boolean
  exigirEspecial: boolean
  expiracaoDias: number
  mfaObrigatorio: boolean
}

export const DEFAULT_POLITICA_SENHA: PoliticaSenha = {
  tamanhoMinimo: 8,
  exigirNumero: true,
  exigirEspecial: false,
  expiracaoDias: 90,
  mfaObrigatorio: false,
}

export function PoliticaSenhaDialog({ open, onOpenChange, value, onSave }: {
  open: boolean
  onOpenChange: (o: boolean) => void
  value: PoliticaSenha
  onSave: (p: PoliticaSenha) => void
}) {
  const [pref, setPref] = useState<PoliticaSenha>(value)

  useEffect(() => { if (open) setPref(value) }, [open, value])

  function salvar() {
    onSave(pref)
    toast.success('Política de senha atualizada.')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Política de senha</DialogTitle>
          <DialogDescription>Regras aplicadas a todos os usuários do sistema.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Tamanho mínimo</Label>
            <Input
              type="number" min={6} max={32}
              value={pref.tamanhoMinimo}
              onChange={(e) => setPref((p) => ({ ...p, tamanhoMinimo: e.target.valueAsNumber || 6 }))}
            />
          </div>
          <div className="grid gap-2">
            <Label>Expiração (dias)</Label>
            <Input
              type="number" min={0} max={365}
              value={pref.expiracaoDias}
              onChange={(e) => setPref((p) => ({ ...p, expiracaoDias: e.target.valueAsNumber || 0 }))}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label className="text-sm font-normal">Exigir ao menos um número</Label>
            <Switch checked={pref.exigirNumero} onCheckedChange={(v) => setPref((p) => ({ ...p, exigirNumero: v }))} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label className="text-sm font-normal">Exigir caractere especial</Label>
            <Switch checked={pref.exigirEspecial} onCheckedChange={(v) => setPref((p) => ({ ...p, exigirEspecial: v }))} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label className="text-sm font-normal">MFA obrigatório</Label>
            <Switch checked={pref.mfaObrigatorio} onCheckedChange={(v) => setPref((p) => ({ ...p, mfaObrigatorio: v }))} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={salvar}>Salvar política</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
