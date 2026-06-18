import { useMemo } from 'react'
import { CalendarClock, ClipboardCheck, ShieldAlert } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/patterns/stat-card'
import { MedicoesProvider, useMedicoes } from '@/features/medicao/medicoes-context'
import { MedicoesTable } from '@/features/medicao/medicoes-table'

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
      <StatCard label="Agendadas" value={String(stats.agendadas)} icon={CalendarClock} />
      <StatCard label="Aprovadas" value={String(stats.aprovadas)} icon={ClipboardCheck} />
      <StatCard label="Bloqueadas por alçada" value={String(stats.bloqueadas)} icon={ShieldAlert} />
    </div>
  )
}

export default function MedicaoPage() {
  return (
    <MedicoesProvider>
      <div>
        <PageHeader
          breadcrumb="Operações · Medição e Conferência"
          title="Medição e Conferência"
          description="Agenda de visitas técnicas, checklist e liberação para compra."
        />
        <MedicaoKpis />
        <div className="mt-6">
          <MedicoesTable />
        </div>
      </div>
    </MedicoesProvider>
  )
}
