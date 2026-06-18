import { z } from 'zod'

export const projetoSchema = z.object({
  cliente: z.string().min(3, 'Informe o cliente.'),
  ambiente: z.string().min(3, 'Informe o ambiente.'),
  projetista: z.string().min(1, 'Selecione o projetista.'),
  etapa: z.enum(['projeto', 'medicao', 'tecnico', 'producao', 'montagem']),
  valor: z.number({ message: 'Informe o valor.' }).min(0, 'Valor inválido.'),
  software: z.enum(['Promob', 'Gabster', 'SketchUp + plugin', 'Dinabox']),
})

export type ProjetoSchemaValues = z.infer<typeof projetoSchema>
