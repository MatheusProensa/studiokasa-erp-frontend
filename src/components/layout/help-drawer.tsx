import { useLocation } from 'react-router-dom'
import { Lightbulb } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { HELP } from '@/lib/help'

interface HelpDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** "Como usar esta tela" — guia passo a passo conforme a rota atual. */
export function HelpDrawer({ open, onOpenChange }: HelpDrawerProps) {
  const { pathname } = useLocation()
  const help = HELP[pathname] ?? HELP['/']

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Como usar esta tela
          </span>
          <SheetTitle>{help.titulo}</SheetTitle>
          <SheetDescription>{help.intro}</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-6">
          <ol className="space-y-3">
            {help.passos.map((passo, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed">{passo}</span>
              </li>
            ))}
          </ol>

          {help.dica && (
            <div className="flex gap-2 rounded-lg border border-[var(--status-info)]/30 bg-accent p-3 text-sm">
              <Lightbulb className="size-4 shrink-0 text-primary" />
              <span className="text-accent-foreground">{help.dica}</span>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
