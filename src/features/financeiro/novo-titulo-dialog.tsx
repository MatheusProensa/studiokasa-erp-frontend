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
import { useFinanceiro } from './financeiro-context'
import { CATEGORIAS_PAGAR, FORMAS_RECEBER } from './constants'
import type { TituloTipo } from './constants'

const schema = z.object({
  descricao: z.string().min(3, 'Informe a descrição.'),
  contraparte: z.string().min(2, 'Informe o cliente ou fornecedor.'),
  categoria: z.string().min(1, 'Selecione a categoria.'),
  valor: z.number().min(0.01, 'Valor inválido.'),
  vencimento: z.string().min(1, 'Informe o vencimento.'),
})

type Values = z.infer<typeof schema>

const EMPTY: Values = { descricao: '', contraparte: '', categoria: '', valor: 0, vencimento: '' }

export function NovoTituloDialog({
  open, onOpenChange, tipo,
}: { open: boolean; onOpenChange: (o: boolean) => void; tipo: TituloTipo }) {
  const { adicionarTitulo } = useFinanceiro()
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: EMPTY })

  useEffect(() => { if (open) form.reset(EMPTY) }, [open, form])

  const categorias = tipo === 'pagar' ? CATEGORIAS_PAGAR : FORMAS_RECEBER
  const titulo = tipo === 'pagar' ? 'Nova Despesa' : 'Nova Receita'
  const desc = tipo === 'pagar' ? 'Registre um título a pagar.' : 'Registre um título a receber.'

  function handleSubmit(v: Values) {
    adicionarTitulo({ ...v, tipo, status: 'aberto' })
    toast.success(`${titulo} registrada com sucesso.`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField control={form.control} name="descricao" render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl><Input placeholder="Ex: Parcela 1/3 — Projeto Silva" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="contraparte" render={({ field }) => (
                <FormItem>
                  <FormLabel>{tipo === 'pagar' ? 'Fornecedor' : 'Cliente'}</FormLabel>
                  <FormControl><Input placeholder="Nome" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="categoria" render={({ field }) => (
                <FormItem>
                  <FormLabel>{tipo === 'pagar' ? 'Categoria' : 'Forma de recebimento'}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {categorias.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="valor" render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step={0.01} value={field.value || ''} onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="vencimento" render={({ field }) => (
                <FormItem>
                  <FormLabel>Vencimento</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
