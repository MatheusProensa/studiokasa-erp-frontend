import type { AccessRole } from '@/types'

export type UserStatus = 'ativo' | 'inativo'

/** Usuário do sistema, como aparece na administração (Módulo 0). */
export interface SystemUser {
  id: number
  name: string
  email: string
  roles: AccessRole[]
  status: UserStatus
  /** Loja/unidade — relevante pra rede de lojas. */
  unidade: string
  /** ISO date do último acesso (ou null se nunca acessou). */
  lastAccess: string | null
  /** Vincula a um colaborador do RH (features/rh/mock-data); null = usuário sem colaborador (ex: externo). */
  colaboradorId: number | null
}
