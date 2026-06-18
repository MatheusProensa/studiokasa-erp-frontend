import { useMemo } from 'react'
import { FileText, FileInput, ShieldCheck, FileCheck2, XCircle, Coins } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/patterns/stat-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FiscalProvider, useFiscal } from '@/features/fiscal/fiscal-context'
import { NotasTab } from '@/features/fiscal/notas-tab'
import { EntradasTab } from '@/features/fiscal/entradas-tab'
import { CertificadoTab } from '@/features/fiscal/certificado-tab'
import { formatBRL } from '@/lib/format'

function FiscalKpis() {
  const { notas, entradas } = useFiscal()
  const stats = useMemo(() => {
    const autorizadas = notas.filter((n) => n.status === 'autorizada').length
    const rejeitadas = notas.filter((n) => n.status === 'rejeitada').length
    const credito = entradas.reduce((s, e) => s + (e.escriturada ? e.credito : 0), 0)
    return { autorizadas, rejeitadas, credito }
  }, [notas, entradas])

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="Notas autorizadas" value={String(stats.autorizadas)} icon={FileCheck2} />
      <StatCard label="Rejeitadas" value={String(stats.rejeitadas)} icon={XCircle} />
      <StatCard label="Crédito tributário" value={formatBRL(stats.credito)} icon={Coins} />
    </div>
  )
}

export default function FiscalPage() {
  return (
    <FiscalProvider>
      <div>
        <PageHeader
          breadcrumb="Financeiro · Fiscal e Contábil"
          title="Fiscal e Contábil"
          description="Emissão de notas, escrituração de entradas e Reforma Tributária (IBS/CBS)."
        />
        <FiscalKpis />

        <Tabs defaultValue="notas" className="mt-6">
          <TabsList>
            <TabsTrigger value="notas">
              <FileText className="size-4" />
              Notas emitidas
            </TabsTrigger>
            <TabsTrigger value="entradas">
              <FileInput className="size-4" />
              Entradas
            </TabsTrigger>
            <TabsTrigger value="certificado">
              <ShieldCheck className="size-4" />
              Certificado & SEFAZ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notas" className="mt-6">
            <NotasTab />
          </TabsContent>
          <TabsContent value="entradas" className="mt-6">
            <EntradasTab />
          </TabsContent>
          <TabsContent value="certificado" className="mt-6">
            <CertificadoTab />
          </TabsContent>
        </Tabs>
      </div>
    </FiscalProvider>
  )
}
