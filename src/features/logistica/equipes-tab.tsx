import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NameAvatar } from '@/components/ui/name-avatar'
import { useLogistica } from './logistica-context'
import { EQUIPES_INFO } from './mock-data'

export function EquipesTab() {
  const { ordens } = useLogistica()

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {EQUIPES_INFO.map((equipe) => {
        const ativas = ordens.filter(
          (o) => o.equipe === equipe.nome && o.status !== 'concluida',
        ).length
        return (
          <Card key={equipe.nome}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{equipe.nome}</CardTitle>
              <Badge variant="secondary">{ativas} OS ativas</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              {equipe.membros.map((m) => (
                <div key={m} className="flex items-center gap-2 text-sm">
                  <NameAvatar name={m} size="sm" />
                  {m}
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
