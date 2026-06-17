import type { LucideIcon } from 'lucide-react'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  delta?: string
  deltaNote?: string
  deltaDirection?: 'up' | 'down'
}

/** Tile de KPI do dashboard — número grande + variação opcional. */
export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaNote,
  deltaDirection = 'up',
}: StatCardProps) {
  const down = deltaDirection === 'down'
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-primary">
            <Icon className="size-[18px]" />
          </span>
        </div>
        <p className="mt-3 text-3xl font-bold tracking-tight tabular-nums">{value}</p>
        {(delta || deltaNote) && (
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            {delta && (
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 font-semibold',
                  down ? 'text-[var(--status-danger)]' : 'text-[var(--status-success)]',
                )}
              >
                {down ? <ArrowDown className="size-3" /> : <ArrowUp className="size-3" />}
                {delta}
              </span>
            )}
            {deltaNote && <span className="text-muted-foreground">{deltaNote}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
