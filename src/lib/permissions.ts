import type { AccessRole, User } from '@/types'

/**
 * Helpers de RBAC no frontend.
 * Espelham o spatie/laravel-permission do backend — a verificação REAL é sempre
 * no servidor; aqui é só pra esconder/exibir UI.
 */

export function hasRole(user: User | null, role: AccessRole | AccessRole[]): boolean {
  if (!user) return false
  const roles = Array.isArray(role) ? role : [role]
  return roles.some((r) => user.roles.includes(r))
}

export function hasPermission(user: User | null, permission: string | string[]): boolean {
  if (!user) return false
  // Diretor enxerga tudo (super-admin de negócio).
  if (user.roles.includes('diretor')) return true
  const perms = Array.isArray(permission) ? permission : [permission]
  return perms.some((p) => user.permissions.includes(p))
}

/** Alçada de desconto por papel (Módulo 0 — política de comissão/desconto). */
const DISCOUNT_CEILING: Partial<Record<AccessRole, number>> = {
  vendedor: 5,
  supervisor: 10,
  gerente: 20,
  diretor: 100,
}

export function maxDiscountPercent(user: User | null): number {
  if (!user) return 0
  return Math.max(0, ...user.roles.map((r) => DISCOUNT_CEILING[r] ?? 0))
}
