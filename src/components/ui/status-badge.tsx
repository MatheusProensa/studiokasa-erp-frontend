import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type StatusTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral'

const TONE: Record<StatusTone, string> = {
  info: 'bg-[var(--status-info-soft)] text-[var(--status-info)]',
  success: 'bg-[var(--status-success-soft)] text-[var(--status-success)]',
  warning: 'bg-[var(--status-warning-soft)] text-[var(--status-warning)]',
  danger: 'bg-[var(--status-danger-soft)] text-[var(--status-danger)]',
  neutral: 'bg-[var(--status-neutral-soft)] text-[var(--status-neutral)]',
}

const DOT: Record<StatusTone, string> = {
  info: 'bg-[var(--status-info)]',
  success: 'bg-[var(--status-success)]',
  warning: 'bg-[var(--status-warning)]',
  danger: 'bg-[var(--status-danger)]',
  neutral: 'bg-[var(--status-neutral)]',
}

interface StatusBadgeProps {
  tone: StatusTone
  children: ReactNode
  className?: string
}

/** Pill de estado de workflow — fill suave + dot. (Ex: "Em produção", "Atrasado") */
export function StatusBadge({ tone, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        TONE[tone],
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', DOT[tone])} />
      {children}
    </span>
  )
}
