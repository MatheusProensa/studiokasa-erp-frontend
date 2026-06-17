import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/features/auth/auth-context'
import { AppLayout } from '@/layouts/app-layout'
import { AuthLayout } from '@/layouts/auth-layout'
import LoginPage from '@/pages/auth/login'
import DashboardPage from '@/pages/dashboard'
import CrmPage from '@/pages/crm'
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
            {NAV_ITEMS.filter((i) => i.href !== '/' && i.href !== '/crm').map((item) => (
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
