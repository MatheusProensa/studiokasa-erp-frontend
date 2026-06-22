import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check, CalendarCheck, FileText, Download, LifeBuoy, MessageSquare,
  Phone, User, BarChart2, LayoutGrid, HelpCircle, Send,
} from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { Input } from '@/components/ui/input'
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
  const navigate = useNavigate()
  const [agendas, setAgendas] = useState<Agenda[]>(AGENDAS)
  const [aprovacoes, setAprovacoes] = useState<Aprovacao[]>(APROVACOES)
  const [mensagens, setMensagens] = useState([
    { autor: 'StudioKasa', texto: 'Seu projeto está em produção! Previsão de entrega para 28/06.', hora: '10:24' },
  ])
  const [novaMensagem, setNovaMensagem] = useState('')

  function enviarMensagem() {
    if (!novaMensagem.trim()) return
    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    setMensagens((prev) => [...prev, { autor: 'Você', texto: novaMensagem, hora }])
    setNovaMensagem('')
    setTimeout(() => {
      setMensagens((prev) => [...prev, { autor: 'StudioKasa', texto: 'Recebido! Já vamos verificar e te respondemos em breve.', hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }])
    }, 1200)
  }

  function baixarDocumento(nome: string, tipo: string) {
    const blob = new Blob([`${nome}\nTipo: ${tipo}\nProjeto: ${PROJETO_CLIENTE.codigo} — ${PROJETO_CLIENTE.cliente}\n\n(documento de demonstração)`], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${nome}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`${nome} baixado.`)
  }

  const etapaAtualIdx = JORNADA.findIndex((e) => e.estado === 'atual')
  const progresso = Math.round(((etapaAtualIdx) / (JORNADA.length - 1)) * 100)

  return (
    <div>
      <PageHeader
        breadcrumb="Suporte · Portal do Cliente"
        title="Portal do Cliente"
        description={`${PROJETO_CLIENTE.cliente} · ${PROJETO_CLIENTE.ambiente} · ${PROJETO_CLIENTE.codigo}`}
        actions={
          <Button variant="outline" onClick={() => navigate('/posvenda')}>
            <LifeBuoy className="size-4" /> Solicitar assistência
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Jornada + previsão */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Acompanhamento do projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              {/* Timeline */}
              <ol className="flex-1 space-y-3">
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
                    <div className="flex-1">
                      <span className={cn('text-sm font-medium', etapa.estado === 'pendente' && 'text-muted-foreground')}>
                        {etapa.label}
                      </span>
                      {etapa.data && (
                        <p className="text-xs text-muted-foreground">{etapa.data}</p>
                      )}
                    </div>
                    {etapa.estado === 'atual' && <StatusBadge tone="info">Agora</StatusBadge>}
                  </li>
                ))}
              </ol>

              {/* Previsão + progresso */}
              <div className="w-48 shrink-0 space-y-4">
                <div className="rounded-xl border bg-muted/30 p-4 text-center">
                  <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                    <CalendarCheck className="size-5" />
                  </div>
                  <p className="text-xs text-muted-foreground">Previsão de entrega</p>
                  <p className="mt-1 text-lg font-bold">28/06/2026</p>
                  <p className="text-xs text-muted-foreground">Em 10 dias</p>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progresso geral</span>
                    <span className="font-semibold">{progresso}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progresso}%` }} />
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
                  <p className="text-xs font-semibold text-emerald-700">✦ Fique tranquilo!</p>
                  <p className="mt-0.5 text-xs text-emerald-600">Seu projeto está dentro do prazo.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="size-4" /> Chat com a loja
              <span className="ml-auto flex items-center gap-1 text-xs font-normal text-[var(--status-success)]">
                <span className="size-2 rounded-full bg-[var(--status-success)]" /> Online
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="max-h-56 space-y-2 overflow-y-auto">
              {mensagens.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    'rounded-xl p-3 text-sm',
                    m.autor === 'Você' ? 'ml-6 bg-primary text-primary-foreground' : 'mr-6 bg-muted',
                  )}
                >
                  <p className={cn('mb-1 text-xs font-medium', m.autor === 'Você' ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                    {m.autor} · {m.hora}
                  </p>
                  {m.texto}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Escreva uma mensagem..."
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
              />
              <Button size="icon" onClick={enviarMensagem} disabled={!novaMensagem.trim()}>
                <Send className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Aprovações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Aprovações pendentes
              {aprovacoes.length > 0 && (
                <Badge className="size-5 justify-center rounded-full p-0 text-xs">{aprovacoes.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {aprovacoes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma aprovação pendente.</p>
            ) : (
              aprovacoes.map((a) => (
                <div key={a.id} className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-100">
                      <span className="text-xs text-amber-600">!</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{a.titulo}</p>
                      <p className="text-xs text-muted-foreground">{a.descricao}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setAprovacoes((prev) => prev.filter((x) => x.id !== a.id))
                        toast.success('Etapa aprovada.')
                      }}
                    >
                      <Check className="size-4" /> Aprovar
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => { setAprovacoes((prev) => prev.filter((x) => x.id !== a.id)); toast.warning('Revisão solicitada.') }}>Rejeitar</Button>
                  </div>
                </div>
              ))
            )}
            <button className="w-full text-center text-xs text-primary hover:underline" onClick={() => toast.info('Todas as aprovações pendentes estão listadas acima. Aprove ou rejeite cada item.')}>
              Ver todas aprovações →
            </button>
          </CardContent>
        </Card>

        {/* Agendas */}
        <Card>
          <CardHeader>
            <CardTitle>Confirmar agendas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {agendas.map((ag) => (
              <div key={ag.id} className="rounded-xl border p-3">
                <div className="flex items-start gap-2">
                  <CalendarCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1">
                    <span className="text-sm font-medium">{ag.titulo}</span>
                    <p className="text-xs text-muted-foreground">{formatDateTime(ag.quando)}</p>
                  </div>
                  {ag.confirmada ? (
                    <StatusBadge tone="success">Confirmada</StatusBadge>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => {
                        setAgendas((prev) => prev.map((x) => (x.id === ag.id ? { ...x, confirmada: true } : x)))
                        toast.success('Agenda confirmada.')
                      }}
                    >
                      Confirmar
                    </Button>
                  )}
                </div>
                {!ag.confirmada && (
                  <p className="mt-2 text-xs text-muted-foreground pl-6">
                    Confirme para que possamos agendar a logística com precisão.
                  </p>
                )}
              </div>
            ))}
            <button className="w-full text-center text-xs text-primary hover:underline" onClick={() => toast.info('Todas as agendas do seu projeto estão listadas acima. Confirme cada uma para agendar a logística.')}>
              Ver todas agendas →
            </button>
          </CardContent>
        </Card>

        {/* Documentos */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {DOCUMENTOS.map((d) => (
              <div key={d.nome} className="flex items-center justify-between rounded-xl border p-3 text-sm">
                <span className="flex items-center gap-2">
                  <FileText className="size-4 text-muted-foreground" />
                  <span>{d.nome}</span>
                  <Badge variant="secondary" className="text-xs">{d.tipo}</Badge>
                </span>
                <Button variant="ghost" size="icon" className="size-8" onClick={() => baixarDocumento(d.nome, d.tipo)}>
                  <Download className="size-4" />
                </Button>
              </div>
            ))}
            <button className="w-full text-center text-xs text-primary hover:underline" onClick={() => toast.info('Para solicitar documentos adicionais, entre em contato com seu consultor.')}>
              Ver todos documentos →
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Footer info bar */}
      <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl border bg-muted/30 p-4 sm:grid-cols-4 lg:grid-cols-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
            <Phone className="size-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Atendimento</p>
            <p className="text-xs font-semibold">(11) 99999-0000</p>
            <p className="text-xs text-muted-foreground">Seg - Sex, 08h às 18h</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
            <User className="size-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Responsável</p>
            <p className="text-xs font-semibold">Marina Alves</p>
            <p className="text-xs text-muted-foreground">Consultora de projetos</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <BarChart2 className="size-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status do projeto</p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-primary" />
              <span className="text-xs font-semibold">Em produção</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <LayoutGrid className="size-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Ambiente</p>
            <p className="text-xs font-semibold">Cozinha planejada</p>
          </div>
        </div>
        <div className="col-span-2 flex items-center gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-2 sm:col-span-4 lg:col-span-1">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <HelpCircle className="size-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-primary">Dúvidas ou solicitações?</p>
            <p className="text-xs text-muted-foreground">Estamos aqui para ajudar!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
