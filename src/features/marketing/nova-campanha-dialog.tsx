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
import { CANAIS } from './constants'
import { CAMPANHAS } from './mock-data'
import type { Campanha } from './types'

const TIPOS = ['Awareness', 'Conversão', 'Retenção', 'Sazonalidade']
const RESPONSAVEIS = ['Renata Vargas', 'Carlos Dias', 'Marina Alves']

const schema = z.object({
  nome: z.string().min(3, 'Informe o nome da campanha.'),
  tipo: z.string().min(1, 'Selecione o tipo.'),
  canal: z.string().min(1, 'Selecione o canal.'),
  responsavel: z.string().min(1, 'Selecione o responsável.'),
  investimento: z.number().min(0.01, 'Informe o investimento.'),
})

type Values = z.infer<typeof schema>

const EMPTY: Values = { nome: '', tipo: '', canal: '', responsavel: '', investimento: 0 }

export function NovaCampanhaDialog({ open, onOpenChange, campanha, onAdded }: {
  open: boolean
  onOpenChange: (o: boolean) => void
  /** Campanha em edição; ausente = criação. */
  campanha?: Campanha | null
  onAdded?: (c: Campanha) => void
}) {
  const isEdit = Boolean(campanha)
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: EMPTY })

  useEffect(() => {
    if (open) {
      form.reset(
        campanha
          ? { nome: campanha.nome, tipo: campanha.tipo, canal: campanha.canal, responsavel: campanha.responsavel, investimento: campanha.investimento }
          : EMPTY,
      )
    }
  }, [open, campanha, form])

  function handleSubmit(v: Values) {
    if (isEdit && campanha) {
      const atualizada: Campanha = { ...campanha, ...v }
      const idx = CAMPANHAS.findIndex((c) => c.id === campanha.id)
      if (idx >= 0) CAMPANHAS[idx] = atualizada
      onAdded?.(atualizada)
      toast.success(`Campanha "${v.nome}" atualizada.`)
    } else {
      const nova: Campanha = {
        id: Math.max(0, ...CAMPANHAS.map((c) => c.id)) + 1,
        ...v,
        status: 'ativa',
      }
      CAMPANHAS.push(nova)
      onAdded?.(nova)
      toast.success(`Campanha "${v.nome}" criada com sucesso.`)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar campanha' : 'Nova Campanha'}</DialogTitle>
          <DialogDescription>{isEdit ? 'Atualize os dados da campanha.' : 'Configure uma nova campanha de marketing.'}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField control={form.control} name="nome" render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da campanha</FormLabel>
                <FormControl><Input placeholder="Ex: Lançamento Verão 2026" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="tipo" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {TIPOS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="canal" render={({ field }) => (
                <FormItem>
                  <FormLabel>Canal</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {CANAIS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="responsavel" render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {RESPONSAVEIS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="investimento" render={({ field }) => (
                <FormItem>
                  <FormLabel>Investimento (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step={0.01} value={field.value || ''} onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit">{isEdit ? 'Salvar alterações' : 'Criar campanha'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
