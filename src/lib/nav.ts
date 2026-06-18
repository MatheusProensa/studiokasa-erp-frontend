import {
  LayoutDashboard,
  BarChart3,
  Users,
  FolderKanban,
  Ruler,
  ClipboardList,
  ShoppingCart,
  Warehouse,
  Truck,
  Wallet,
  FileText,
  Headset,
  Megaphone,
  UserCircle,
  HeartHandshake,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  /** Nº do módulo no ERP (referência ao planejamento). */
  module: number
  label: string
  href: string
  icon: LucideIcon
  /** Permissão/papel necessário pra ver o item (opcional). */
  permission?: string
}

export interface NavSection {
  title: string
  items: NavItem[]
}

/** Menu principal — agrupado em seções corporativas (segue o UI kit StudioKasa). */
export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Geral',
    items: [
      { module: -1, label: 'Dashboard', href: '/', icon: LayoutDashboard },
      { module: 13, label: 'BI e Dashboards', href: '/bi', icon: BarChart3 },
    ],
  },
  {
    title: 'Comercial',
    items: [
      { module: 1, label: 'CRM e Vendas', href: '/crm', icon: Users },
      { module: 2, label: 'Projetos', href: '/projetos', icon: FolderKanban },
      { module: 11, label: 'Marketing', href: '/marketing', icon: Megaphone },
    ],
  },
  {
    title: 'Operações',
    items: [
      { module: 3, label: 'Medição e Conferência', href: '/medicao', icon: Ruler },
      { module: 4, label: 'Pedido ao Fornecedor', href: '/pedidos', icon: ClipboardList },
      { module: 5, label: 'Compras e Suprimentos', href: '/compras', icon: ShoppingCart },
      { module: 6, label: 'Estoque e WMS', href: '/estoque', icon: Warehouse },
      { module: 9, label: 'Logística e Montagem', href: '/logistica', icon: Truck },
    ],
  },
  {
    title: 'Financeiro',
    items: [
      { module: 7, label: 'Financeiro', href: '/financeiro', icon: Wallet },
      { module: 8, label: 'Fiscal e Contábil', href: '/fiscal', icon: FileText },
    ],
  },
  {
    title: 'Suporte',
    items: [
      { module: 10, label: 'Pós-venda', href: '/posvenda', icon: Headset },
      { module: 12, label: 'Portal do Cliente', href: '/portal', icon: UserCircle },
      { module: 14, label: 'RH e Pessoas', href: '/rh', icon: HeartHandshake },
      { module: 0, label: 'Administração', href: '/adm', icon: Settings },
    ],
  },
]

/** Lista achatada — útil pra gerar rotas e lookups por href. */
export const NAV_ITEMS: NavItem[] = NAV_SECTIONS.flatMap((s) => s.items)
