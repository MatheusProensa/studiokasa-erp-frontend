import type { LucideIcon } from 'lucide-react'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Sparkline, seedSeries } from './sparkline'

type Tone = 'primary' | 'secondary' | 'success' | 'danger'

const TONE_COLOR: Record<Tone, string> = {
  primary: 'var(--chart-1)',
  secondary: 'var(--chart-3)',
  success: 'var(--status-success)',
  danger: 'var(--status-danger)',
}

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  delta?: string
  deltaNote?: string
  deltaDirection?: 'up' | 'down'
  /** Série do mini-gráfico; se ausente, gera uma determinística pelo label. */
  trend?: number[]
  tone?: Tone
  className?: string
}

/** Tile de KPI — número grande + variação + mini-gráfico (sparkline). */
export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaNote,
  deltaDirection = 'up',
  trend,
  tone,
  className,
}: StatCardProps) {
  const down = deltaDirection === 'down'
  const resolvedTone: Tone = tone ?? (down ? 'danger' : 'primary')
  const series = trend ?? seedSeries(label, 14, !down)

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-5 pb-0">
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
      <div className="mt-2">
        <Sparkline data={series} color={TONE_COLOR[resolvedTone]} height={36} />
      </div>
    </Card>
  )
}
