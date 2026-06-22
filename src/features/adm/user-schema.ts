import { z } from 'zod'
import type { AccessRole } from '@/types'

const ROLE_VALUES: [AccessRole, ...AccessRole[]] = [
  'projetista', 'conferente', 'estoquista', 'financeiro', 'marketing',
  'vendedor', 'supervisor', 'gerente', 'diretor',
]

/** Validação do formulário de usuário (Módulo 0). */
export const userSchema = z.object({
  name: z.string().min(3, 'Informe o nome completo.'),
  email: z.string().email('E-mail inválido.'),
  unidade: z.string().min(1, 'Selecione a unidade.'),
  roles: z.array(z.enum(ROLE_VALUES)).min(1, 'Selecione ao menos um papel.'),
  status: z.enum(['ativo', 'inativo']),
  colaboradorId: z.number().nullable(),
})

export type UserFormValues = z.infer<typeof userSchema>
