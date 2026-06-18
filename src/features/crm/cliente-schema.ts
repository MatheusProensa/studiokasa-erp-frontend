import { z } from 'zod'

export const clienteSchema = z.object({
  nome: z.string().min(3, 'Informe o nome do cliente.'),
  tipo: z.enum(['PF', 'PJ']),
  documento: z.string().min(11, 'Informe o CPF ou CNPJ.'),
  telefone: z.string().min(8, 'Informe um telefone.'),
  email: z.string().email('E-mail inválido.'),
  cidade: z.string().min(2, 'Informe a cidade.'),
  origem: z.enum(['Instagram', 'Indicação', 'Loja física', 'Arquiteto', 'Anúncio']),
})

export type ClienteFormValues = z.infer<typeof clienteSchema>
