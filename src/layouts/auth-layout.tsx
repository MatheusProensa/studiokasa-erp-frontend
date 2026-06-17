import { Outlet } from 'react-router-dom'
import { Check } from 'lucide-react'
import wordmark from '@/assets/brand/logo-wordmark-white.png'

const FEATURES = [
  'Vendas, CRM e propostas',
  'Projetos, medição e produção',
  'Estoque, financeiro e fiscal',
]

/** Layout das telas públicas (login, recuperação de senha). */
export function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Painel da marca */}
      <div className="relative hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <img src={wordmark} alt="StudioKasa ambientes" className="h-12 w-auto self-start" />

        <div className="space-y-5">
          <h1 className="text-3xl font-extrabold leading-tight">
            Gestão completa,
            <br />
            do projeto à entrega.
          </h1>
          <p className="max-w-sm text-primary-foreground/70">
            Plataforma ERP integrada para móveis e ambientes planejados.
          </p>
          <ul className="space-y-2.5">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-primary-foreground/90">
                <span className="flex size-5 items-center justify-center rounded-full bg-secondary">
                  <Check className="size-3" />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-primary-foreground/50">© StudioKasa · ERP</p>
      </div>

      {/* Formulário */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
