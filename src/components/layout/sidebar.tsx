import { NavLink } from 'react-router-dom'
import { NAV_SECTIONS } from '@/lib/nav'
import { cn } from '@/lib/utils'
import monogram from '@/assets/brand/logo-monogram-white.png'

export function Sidebar() {
  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
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
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                    'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    isActive && 'bg-sidebar-accent text-sidebar-accent-foreground',
                  )
                }
              >
                <item.icon className="size-[17px] shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-2 border-t border-sidebar-border px-5 py-4 text-xs text-sidebar-foreground/65">
        <span className="size-2 rounded-full bg-[var(--status-success)]" />
        Sistema operacional · v0.1.0
      </div>
    </aside>
  )
}
