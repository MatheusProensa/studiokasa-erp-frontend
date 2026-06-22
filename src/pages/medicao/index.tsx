import { useState, useMemo } from 'react'
import { CalendarClock, ClipboardCheck, ShieldAlert, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MedicoesProvider, useMedicoes } from '@/features/medicao/medicoes-context'
import { MedicoesTable } from '@/features/medicao/medicoes-table'
import { AgendarFormDialog } from '@/features/medicao/agendar-form-dialog'

function BigStatCard({
  label, value, note, icon: Icon, iconBg,
}: {
  label: string; value: string; note: string; icon: React.ElementType; iconBg: string
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="mt-2 text-5xl font-bold">{value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{note}</p>
          </div>
          <div className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
            <Icon className="size-7" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MedicaoKpis() {
  const { medicoes } = useMedicoes()
  const stats = useMemo(() => {
    const agendadas = medicoes.filter((m) => m.status === 'agendada').length
    const aprovadas = medicoes.filter((m) => m.status === 'aprovada').length
    const bloqueadas = medicoes.filter((m) => m.status === 'bloqueada').length
    return { agendadas, aprovadas, bloqueadas }
  }, [medicoes])

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <BigStatCard label="Agendadas" value={String(stats.agendadas)} note="Próximas visitas agendadas" icon={CalendarClock} iconBg="bg-sky-50 text-sky-500" />
      <BigStatCard label="Aprovadas" value={String(stats.aprovadas)} note="Medições aprovadas" icon={ClipboardCheck} iconBg="bg-emerald-50 text-emerald-500" />
      <BigStatCard label="Bloqueadas por lacada" value={String(stats.bloqueadas)} note="Aguardando correção" icon={ShieldAlert} iconBg="bg-amber-50 text-amber-500" />
    </div>
  )
}

function MedicaoContent() {
  const [agendarOpen, setAgendarOpen] = useState(false)

  return (
    <div>
      <PageHeader
        breadcrumb="Operações · Medição e Conferência"
        title="Medição e Conferência"
        description="Agenda de visitas técnicas, checklist e liberação para compra."
        actions={
          <Button onClick={() => setAgendarOpen(true)}>
            <Plus className="size-4" />
            Agendar medição
          </Button>
        }
      />

      <MedicaoKpis />

      <div className="mt-6">
        <MedicoesTable />
      </div>

      <AgendarFormDialog open={agendarOpen} onOpenChange={setAgendarOpen} />
    </div>
  )
}

export default function MedicaoPage() {
  return (
    <MedicoesProvider>
      <MedicaoContent />
    </MedicoesProvider>
  )
}
