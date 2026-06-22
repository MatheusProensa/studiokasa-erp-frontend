import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useLogistica } from './logistica-context'
import { EQUIPES } from './constants'

const schema = z.object({
  cliente: z.string().min(2, 'Informe o cliente.'),
  ambiente: z.string().min(2, 'Informe o ambiente/serviço.'),
  equipe: z.string().min(1, 'Selecione a equipe.'),
  veiculo: z.string().min(2, 'Informe o veículo.'),
  agenda: z.string().min(1, 'Informe a data/hora.'),
})

type Values = z.infer<typeof schema>

const EMPTY: Values = { cliente: '', ambiente: '', equipe: '', veiculo: '', agenda: '' }

export function NovaOsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { adicionarOrdem, ordens } = useLogistica()
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: EMPTY })

  useEffect(() => { if (open) form.reset(EMPTY) }, [open, form])

  function handleSubmit(v: Values) {
    const nextNum = Math.max(1000, ...ordens.map((o) => parseInt(o.codigo.replace('OS-', '')) || 0)) + 1
    adicionarOrdem({ codigo: `OS-${nextNum}`, ...v, status: 'agendada' })
    toast.success(`OS-${nextNum} criada com sucesso.`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Ordem de Serviço</DialogTitle>
          <DialogDescription>Agende uma entrega ou montagem para a equipe.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="cliente" render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <FormControl><Input placeholder="Nome do cliente" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="ambiente" render={({ field }) => (
                <FormItem>
                  <FormLabel>Serviço / Ambiente</FormLabel>
                  <FormControl><Input placeholder="Ex: Cozinha planejada" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="equipe" render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipe</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecionar equipe" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {EQUIPES.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="veiculo" render={({ field }) => (
                <FormItem>
                  <FormLabel>Veículo</FormLabel>
                  <FormControl><Input placeholder="Ex: Fiorino · ABC-1D23" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="agenda" render={({ field }) => (
              <FormItem>
                <FormLabel>Data e hora</FormLabel>
                <FormControl><Input type="datetime-local" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit">Criar OS</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
