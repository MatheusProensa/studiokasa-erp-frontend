import { ShieldCheck, Wifi } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import { formatDate } from '@/lib/format'
import { CERTIFICADO } from './mock-data'

export function CertificadoTab() {
  const diasRestantes = Math.ceil(
    (new Date(CERTIFICADO.validade).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  )
  const alerta = diasRestantes <= 30

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="size-5 text-primary" />
            Certificado digital
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Linha label="Titular" valor={CERTIFICADO.titular} />
          <Linha label="CNPJ" valor={CERTIFICADO.cnpj} />
          <Linha label="Tipo" valor={CERTIFICADO.tipo} />
          <Linha label="Validade" valor={formatDate(CERTIFICADO.validade)} />
          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-muted-foreground">Situação</span>
            {alerta ? (
              <StatusBadge tone="warning">Vence em {diasRestantes} dias</StatusBadge>
            ) : (
              <StatusBadge tone="success">Válido ({diasRestantes} dias)</StatusBadge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wifi className="size-5 text-primary" />
            Comunicação SEFAZ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Ambiente</span>
            <span className="font-medium">Produção</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status do serviço</span>
            <StatusBadge tone="success">Operante</StatusBadge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Contingência</span>
            <StatusBadge tone="neutral">Inativa</StatusBadge>
          </div>
          <p className="border-t pt-3 text-xs text-muted-foreground">
            Emissão, consulta, carta de correção e cancelamento via API fiscal. XMLs armazenados pelo
            prazo legal.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function Linha({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{valor}</span>
    </div>
  )
}
