import { NavLink } from 'react-router-dom'
import { NAV_SECTIONS } from '@/lib/nav'
import { cn } from '@/lib/utils'
import monogram from '@/assets/brand/logo-monogram-white.png'

interface SidebarNavProps {
  /** Chamado ao clicar num item (ex: fechar o menu mobile). */
  onNavigate?: () => void
}

/** Conteúdo da navegação — reutilizado na sidebar (desktop) e no menu mobile. */
export function SidebarNav({ onNavigate }: SidebarNavProps) {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#0d2150] via-[#0c1d44] to-[#081530] text-sidebar-foreground">
      {/* Marca */}
      <div className="flex h-16 items-center gap-3 px-5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-sidebar-accent p-1.5">
          <img src={monogram} alt="StudioKasa" className="size-full object-contain" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-bold">StudioKasa</p>
          <p className="text-xs text-sidebar-foreground/60">ERP · Ambientes</p>
        </div>
      </div>

      {/* Navegação por seções */}
      <nav className="nav-scroll flex-1 space-y-3 overflow-y-auto px-3 py-3">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-0.5">
            <p className="px-3 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              {section.title}
            </p>
            {section.items.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'relative flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                    'text-sidebar-foreground/75 hover:bg-white/5 hover:text-sidebar-foreground',
                    isActive &&
                      'bg-gradient-to-r from-[#1e4d8c] to-[#1a3f74] text-white shadow-sm hover:text-white',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 h-5 w-1 rounded-r-full bg-sidebar-primary-foreground" />
                    )}
                    <item.icon className="size-[17px] shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-2 border-t border-sidebar-border px-5 py-4 text-xs text-sidebar-foreground/65">
        <span className="size-2 rounded-full bg-[var(--status-success)]" />
        Sistema operacional · v0.1.0
      </div>
    </div>
  )
}
