import type { AccessRole } from '@/types'

/** Rótulos dos papéis de acesso (Spatie roles) — fonte única de verdade. */
export const ROLE_LABELS: Record<AccessRole, string> = {
  projetista: 'Projetista',
  conferente: 'Conferente',
  estoquista: 'Estoquista',
  financeiro: 'Financeiro',
  marketing: 'Marketing',
  vendedor: 'Vendedor',
  supervisor: 'Supervisor',
  gerente: 'Gerente',
  diretor: 'Diretor(a)',
}

/** Lista ordenada para selects/checkboxes. */
export const ROLE_OPTIONS: { value: AccessRole; label: string }[] = (
  Object.keys(ROLE_LABELS) as AccessRole[]
).map((value) => ({ value, label: ROLE_LABELS[value] }))
