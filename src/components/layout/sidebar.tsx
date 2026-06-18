import { SidebarNav } from './sidebar-nav'

export function Sidebar() {
  return (
    <aside className="hidden h-screen w-64 shrink-0 md:block">
      <SidebarNav />
    </aside>
  )
}
