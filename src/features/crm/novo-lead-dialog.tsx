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
import { ORIGENS, type StageKey } from './constants'
import type { Deal } from './types'

const VENDEDORES = ['Marina Alves', 'Carlos Dias', 'Rui Pena']

const schema = z.object({
  cliente: z.string().min(2, 'Informe o nome do cliente.'),
  origem: z.enum(ORIGENS as unknown as [string, ...string[]]),
  vendedor: z.string().min(1, 'Selecione o vendedor.'),
  valor: z.number().min(0, 'Informe um valor válido.'),
})

type Values = z.infer<typeof schema>

const EMPTY: Values = { cliente: '', origem: ORIGENS[0], vendedor: '', valor: 0 }

export function NovoLeadDialog({ open, onOpenChange, etapa, onCreated }: {
  open: boolean
  onOpenChange: (o: boolean) => void
  etapa: StageKey
  onCreated: (deal: Deal) => void
}) {
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: EMPTY })

  useEffect(() => { if (open) form.reset(EMPTY) }, [open, form])

  function handleSubmit(v: Values) {
    const novo: Deal = {
      id: Date.now(),
      cliente: v.cliente,
      origem: v.origem as Deal['origem'],
      etapa,
      valor: v.valor,
      vendedor: v.vendedor,
      score: 'media',
      proximaAcao: 'Primeiro contato',
      ultimoContato: new Date().toISOString().slice(0, 10),
      probabilidade: 20,
    }
    onCreated(novo)
    toast.success(`Lead "${v.cliente}" adicionado ao funil.`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Novo lead</DialogTitle>
          <DialogDescription>Adicione uma oportunidade ao funil de vendas.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField control={form.control} name="cliente" render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do cliente</FormLabel>
                <FormControl><Input placeholder="Ex: João Silva" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="origem" render={({ field }) => (
              <FormItem>
                <FormLabel>Origem</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    {ORIGENS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="vendedor" render={({ field }) => (
              <FormItem>
                <FormLabel>Vendedor responsável</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {VENDEDORES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="valor" render={({ field }) => (
              <FormItem>
                <FormLabel>Valor estimado (R$)</FormLabel>
                <FormControl><Input type="number" min={0} step={100} value={field.value || ''} onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit">Adicionar lead</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
