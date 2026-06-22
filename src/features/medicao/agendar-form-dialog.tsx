import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CONFERENTES } from './constants'
import { useMedicoes } from './medicoes-context'
import { PROJETOS } from '@/features/projetos/mock-data'

const PROJETOS_APROVADOS = PROJETOS.filter((p) => p.aprovado)

const schema = z.object({
  cliente: z.string().min(3, 'Informe o cliente.'),
  projeto: z.string().min(2, 'Selecione o projeto.'),
  ambiente: z.string().min(2, 'Informe o ambiente.'),
  tipo: z.enum(['preliminar', 'final']),
  conferente: z.string().min(1, 'Selecione o conferente.'),
  agendaInicio: z.string().min(1, 'Informe data e hora.'),
  valorVendido: z.number().min(0, 'Valor inválido.'),
})

type Values = z.infer<typeof schema>

const EMPTY: Values = {
  cliente: '',
  projeto: '',
  ambiente: '',
  tipo: 'final',
  conferente: '',
  agendaInicio: '',
  valorVendido: 0,
}

export function AgendarFormDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const { agendar } = useMedicoes()
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: EMPTY })

  useEffect(() => {
    if (open) form.reset(EMPTY)
  }, [open, form])

  function handleSubmit(v: Values) {
    agendar({ ...v, agendaInicio: new Date(v.agendaInicio).toISOString() })
    toast.success('Medição agendada.')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Agendar medição</DialogTitle>
          <DialogDescription>
            {PROJETOS_APROVADOS.length === 0
              ? 'Nenhum projeto aprovado disponível — aprove um projeto em Projetos antes de agendar a medição.'
              : 'Visita técnica de medição e conferência. Apenas projetos aprovados aparecem na lista.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="projeto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Projeto aprovado</FormLabel>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v)
                      const p = PROJETOS_APROVADOS.find((pr) => pr.codigo === v)
                      if (p) {
                        form.setValue('cliente', p.cliente)
                        form.setValue('ambiente', p.ambiente)
                        form.setValue('valorVendido', p.valor)
                      }
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um projeto aprovado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROJETOS_APROVADOS.map((p) => (
                        <SelectItem key={p.id} value={p.codigo}>
                          {p.codigo} — {p.cliente} ({p.ambiente})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="cliente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Helena Moretti" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ambiente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ambiente</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Cozinha planejada" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="preliminar">Preliminar</SelectItem>
                        <SelectItem value="final">Final</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="conferente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conferente</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CONFERENTES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="agendaInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data e hora</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valorVendido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor vendido (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={100}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={PROJETOS_APROVADOS.length === 0}>Agendar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
