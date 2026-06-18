import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { AccessRole, User } from '@/types'

/**
 * Contexto de autenticação para rodar o frontend STANDALONE (mock).
 * Ao plugar no Laravel/Inertia, troque isto por `usePage().props.auth.user`
 * (as shared props do Inertia) — a interface `User` já está pronta pra isso.
 */

interface AuthContextValue {
  user: User | null
  login: (email: string) => void
  logout: () => void
  /** Troca o papel do usuário (demo de perfis — mock). */
  setRoles: (roles: AccessRole[]) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const MOCK_USER: User = {
  id: 1,
  name: 'Matheus Proensa',
  email: 'matheu.proensa@gmail.com',
  avatarUrl: null,
  roles: ['diretor'],
  permissions: [],
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: (email: string) => setUser({ ...MOCK_USER, email }),
      logout: () => setUser(null),
      setRoles: (roles: AccessRole[]) =>
        setUser((prev) => (prev ? { ...prev, roles } : prev)),
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  return ctx
}
