import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { StatusBadge } from '@/components/ui/status-badge'

export interface IntegracaoAd {
  ativo: boolean
  dominio: string
  servidor: string
}

export const DEFAULT_INTEGRACAO_AD: IntegracaoAd = {
  ativo: false,
  dominio: '',
  servidor: '',
}

export function IntegracaoAdDialog({ open, onOpenChange, value, onSave }: {
  open: boolean
  onOpenChange: (o: boolean) => void
  value: IntegracaoAd
  onSave: (v: IntegracaoAd) => void
}) {
  const [cfg, setCfg] = useState<IntegracaoAd>(value)

  useEffect(() => { if (open) setCfg(value) }, [open, value])

  function salvar() {
    if (cfg.ativo && (!cfg.dominio.trim() || !cfg.servidor.trim())) {
      toast.error('Informe domínio e servidor para ativar a integração.')
      return
    }
    onSave(cfg)
    toast.success(cfg.ativo ? 'Integração com Active Directory ativada.' : 'Integração com Active Directory desativada.')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Integração com Active Directory</DialogTitle>
          <DialogDescription>Sincronize usuários e autenticação com seu AD/LDAP corporativo.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label className="text-sm">Status</Label>
              <p className="text-xs text-muted-foreground">{cfg.ativo ? 'Conectado' : 'Desconectado'}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge tone={cfg.ativo ? 'success' : 'neutral'}>{cfg.ativo ? 'Ativo' : 'Inativo'}</StatusBadge>
              <Switch checked={cfg.ativo} onCheckedChange={(v) => setCfg((c) => ({ ...c, ativo: v }))} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Domínio</Label>
            <Input placeholder="studiokasa.local" value={cfg.dominio} onChange={(e) => setCfg((c) => ({ ...c, dominio: e.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label>Servidor LDAP</Label>
            <Input placeholder="ldap://192.168.0.10:389" value={cfg.servidor} onChange={(e) => setCfg((c) => ({ ...c, servidor: e.target.value }))} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={salvar}>Salvar configuração</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
