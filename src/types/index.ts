/**
 * Tipos globais compartilhados.
 * Quando plugar no Laravel/Inertia, estes tipos devem espelhar os resources/DTOs
 * retornados pelo backend (HandleInertiaRequests::share).
 */

/** Perfis de ACESSO ao sistema (logam) — Módulo 0 / Spatie roles. */
export type AccessRole =
  | 'projetista'
  | 'conferente'
  | 'estoquista'
  | 'financeiro'
  | 'marketing'
  | 'vendedor'
  | 'supervisor'
  | 'gerente'
  | 'diretor'

export interface User {
  id: number
  name: string
  email: string
  avatarUrl?: string | null
  roles: AccessRole[]
  /** Permissões granulares (Spatie permissions), ex: "usuarios.criar". */
  permissions: string[]
}

/** Props compartilhadas pelo Inertia em toda página (espelho de shared props). */
export interface SharedProps {
  auth: {
    user: User | null
  }
}
