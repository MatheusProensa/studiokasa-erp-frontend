import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/features/auth/auth-context'
import { AppLayout } from '@/layouts/app-layout'
import { AuthLayout } from '@/layouts/auth-layout'
import LoginPage from '@/pages/auth/login'
import DashboardPage from '@/pages/dashboard'
import CrmPage from '@/pages/crm'
import AdmPage from '@/pages/adm'
import ProjetosPage from '@/pages/projetos'
import MedicaoPage from '@/pages/medicao'
import PedidosPage from '@/pages/pedidos'
import ComprasPage from '@/pages/compras'
import EstoquePage from '@/pages/estoque'
import FinanceiroPage from '@/pages/financeiro'
import FiscalPage from '@/pages/fiscal'
import LogisticaPage from '@/pages/logistica'
import PosvendaPage from '@/pages/posvenda'
import MarketingPage from '@/pages/marketing'
import BiPage from '@/pages/bi'
import PortalPage from '@/pages/portal'
import ModulePlaceholder from '@/pages/module-placeholder'
import { NAV_ITEMS } from '@/lib/nav'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Públicas */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Autenticadas */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/crm" element={<CrmPage />} />
            <Route path="/adm" element={<AdmPage />} />
            <Route path="/projetos" element={<ProjetosPage />} />
            <Route path="/medicao" element={<MedicaoPage />} />
            <Route path="/pedidos" element={<PedidosPage />} />
            <Route path="/compras" element={<ComprasPage />} />
            <Route path="/estoque" element={<EstoquePage />} />
            <Route path="/financeiro" element={<FinanceiroPage />} />
            <Route path="/fiscal" element={<FiscalPage />} />
            <Route path="/logistica" element={<LogisticaPage />} />
            <Route path="/posvenda" element={<PosvendaPage />} />
            <Route path="/marketing" element={<MarketingPage />} />
            <Route path="/bi" element={<BiPage />} />
            <Route path="/portal" element={<PortalPage />} />
            {NAV_ITEMS.filter((i) => !['/', '/crm', '/adm', '/projetos', '/medicao', '/pedidos', '/compras', '/estoque', '/financeiro', '/fiscal', '/logistica', '/posvenda', '/marketing', '/bi', '/portal'].includes(i.href)).map((item) => (
              <Route
                key={item.href}
                path={item.href}
                element={<ModulePlaceholder module={item.module} title={item.label} />}
              />
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </AuthProvider>
  )
}
