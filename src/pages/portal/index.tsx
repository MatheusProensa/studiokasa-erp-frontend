import { useState } from 'react'
import { Check, CalendarCheck, FileText, Download, LifeBuoy, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { cn } from '@/lib/utils'
import { formatDateTime } from '@/lib/format'
import {
  JORNADA,
  AGENDAS,
  APROVACOES,
  DOCUMENTOS,
  PROJETO_CLIENTE,
  type Agenda,
  type Aprovacao,
} from '@/features/portal/mock-data'

export default function PortalPage() {
  const [agendas, setAgendas] = useState<Agenda[]>(AGENDAS)
  const [aprovacoes, setAprovacoes] = useState<Aprovacao[]>(APROVACOES)

  return (
    <div>
      <PageHeader
        breadcrumb="Suporte · Portal do Cliente"
        title="Portal do Cliente"
        description={`${PROJETO_CLIENTE.cliente} · ${PROJETO_CLIENTE.ambiente} · ${PROJETO_CLIENTE.codigo}`}
        actions={
          <Button variant="outline" onClick={() => toast.success('Chamado de assistência aberto (Módulo 10).')}>
            <LifeBuoy className="size-4" /> Solicitar assistência
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Jornada */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Acompanhamento do projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {JORNADA.map((etapa, i) => (
                <li key={etapa.label} className="flex items-center gap-3">
                  <span
                    className={cn(
                      'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                      etapa.estado === 'concluida' && 'bg-[var(--status-success)] text-white',
                      etapa.estado === 'atual' && 'bg-primary text-primary-foreground',
                      etapa.estado === 'pendente' && 'bg-muted text-muted-foreground',
                    )}
                  >
                    {etapa.estado === 'concluida' ? <Check className="size-4" /> : i + 1}
                  </span>
                  <span className={cn('text-sm', etapa.estado === 'pendente' && 'text-muted-foreground')}>
                    {etapa.label}
                  </span>
                  {etapa.estado === 'atual' && <StatusBadge tone="info">Agora</StatusBadge>}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Chat preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="size-4" /> Chat com a loja
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground">StudioKasa</p>
              Seu projeto está em produção! Previsão de entrega para 28/06.
            </div>
            <Button variant="outline" className="w-full" onClick={() => toast('Chat em tempo real (Pusher/Ably).')}>
              Abrir conversa
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Aprovações */}
        <Card>
          <CardHeader>
            <CardTitle>Aprovações pendentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {aprovacoes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma aprovação pendente.</p>
            ) : (
              aprovacoes.map((a) => (
                <div key={a.id} className="space-y-2 rounded-lg border p-3">
                  <p className="text-sm font-medium">{a.titulo}</p>
                  <p className="text-xs text-muted-foreground">{a.descricao}</p>
                  <Button
                    size="sm"
                    onClick={() => {
                      setAprovacoes((prev) => prev.filter((x) => x.id !== a.id))
                      toast.success('Etapa aprovada.')
                    }}
                  >
                    <Check className="size-4" /> Aprovar
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Agendas */}
        <Card>
          <CardHeader>
            <CardTitle>Confirmar agendas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {agendas.map((ag) => (
              <div key={ag.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-medium">{ag.titulo}</span>
                  <span className="text-xs text-muted-foreground">{formatDateTime(ag.quando)}</span>
                </div>
                {ag.confirmada ? (
                  <StatusBadge tone="success">Confirmada</StatusBadge>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setAgendas((prev) => prev.map((x) => (x.id === ag.id ? { ...x, confirmada: true } : x)))
                      toast.success('Agenda confirmada.')
                    }}
                  >
                    <CalendarCheck className="size-4" /> Confirmar
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Documentos */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {DOCUMENTOS.map((d) => (
              <div key={d.nome} className="flex items-center justify-between rounded-lg border p-2.5 text-sm">
                <span className="flex items-center gap-2">
                  <FileText className="size-4 text-muted-foreground" />
                  {d.nome}
                  <Badge variant="secondary">{d.tipo}</Badge>
                </span>
                <Button variant="ghost" size="icon" className="size-8" onClick={() => toast('Download iniciado.')}>
                  <Download className="size-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
