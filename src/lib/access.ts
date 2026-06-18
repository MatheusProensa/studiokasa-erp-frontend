import type { AccessRole, User } from '@/types'

/**
 * Acesso por perfil — quais telas (rotas) cada papel enxerga.
 * `'*'` = acesso total (cargos de gestão). Espelha o que será aplicado no
 * backend (spatie/laravel-permission); aqui controla sidebar e rotas.
 * O Dashboard ('/') é liberado para todos os perfis autenticados.
 */
export const ROLE_ACCESS: Record<AccessRole, string[] | '*'> = {
  diretor: '*',
  gerente: '*',
  supervisor: '*',
  vendedor: ['/', '/crm', '/projetos'],
  projetista: ['/', '/projetos', '/medicao'],
  conferente: ['/', '/medicao'],
  estoquista: ['/', '/estoque', '/pedidos', '/compras'],
  financeiro: ['/', '/financeiro', '/fiscal'],
  marketing: ['/', '/marketing', '/bi'],
}

/** O usuário pode acessar a rota? Une o acesso de todos os seus papéis. */
export function canAccess(user: User | null, href: string): boolean {
  if (!user) return false
  if (href === '/') return true
  return user.roles.some((role) => {
    const acc = ROLE_ACCESS[role]
    return acc === '*' || acc.includes(href)
  })
}

/** Tem acesso total (gestão)? */
export function isFullAccess(user: User | null): boolean {
  return !!user && user.roles.some((r) => ROLE_ACCESS[r] === '*')
}
