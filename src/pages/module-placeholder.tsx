import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Construction } from 'lucide-react'

interface ModulePlaceholderProps {
  module: number
  title: string
}

/** Placeholder padrão para módulos ainda não implementados. */
export default function ModulePlaceholder({ module, title }: ModulePlaceholderProps) {
  return (
    <div>
      <PageHeader
        title={title}
        description="Módulo planejado — em desenvolvimento."
        actions={<Badge variant="secondary">Módulo {module}</Badge>}
      />
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <Construction className="size-10 text-muted-foreground" />
          <p className="max-w-md text-sm text-muted-foreground">
            Esta tela ainda não foi construída. Seguindo a ordem dos módulos do ERP, ela será
            desenvolvida na fase correspondente.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
