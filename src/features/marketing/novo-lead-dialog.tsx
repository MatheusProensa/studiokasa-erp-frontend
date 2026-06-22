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
import { Switch } from '@/components/ui/switch'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { CANAIS } from './constants'
import { CAMPANHAS } from './mock-data'
import type { LeadMkt } from './types'

const SCORES = [
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Média' },
  { value: 'baixa', label: 'Baixa' },
] as const

const SEM_CAMPANHA = '__none__'

const schema = z.object({
  nome: z.string().min(3, 'Informe o nome do lead.'),
  telefone: z.string().optional(),
  origem: z.string().min(1, 'Selecione a origem.'),
  campanhaId: z.string(),
  score: z.enum(['alta', 'media', 'baixa']),
  consentimento: z.boolean(),
})

type Values = z.infer<typeof schema>

const EMPTY: Values = { nome: '', telefone: '', origem: '', campanhaId: SEM_CAMPANHA, score: 'media', consentimento: false }

export function NovoLeadDialog({ open, onOpenChange, lead, onSaved }: {
  open: boolean
  onOpenChange: (o: boolean) => void
  /** Lead em edição; ausente = criação. */
  lead?: LeadMkt | null
  onSaved: (lead: LeadMkt) => void
}) {
  const isEdit = Boolean(lead)
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: EMPTY })

  useEffect(() => {
    if (open) {
      form.reset(
        lead
          ? {
              nome: lead.nome,
              telefone: lead.telefone ?? '',
              origem: lead.origem,
              campanhaId: lead.campanhaId == null ? SEM_CAMPANHA : String(lead.campanhaId),
              score: lead.score,
              consentimento: lead.consentimento,
            }
          : EMPTY,
      )
    }
  }, [open, lead, form])

  function handleSubmit(v: Values) {
    const campanhaId = v.campanhaId === SEM_CAMPANHA ? null : Number(v.campanhaId)
    if (isEdit && lead) {
      onSaved({ ...lead, nome: v.nome, telefone: v.telefone, origem: v.origem, campanhaId, score: v.score, consentimento: v.consentimento })
      toast.success(`Lead "${v.nome}" atualizado.`)
    } else {
      onSaved({
        id: Date.now(),
        nome: v.nome,
        telefone: v.telefone,
        origem: v.origem,
        campanhaId,
        score: v.score,
        consentimento: v.consentimento,
        status: 'novo',
      })
      toast.success(`Lead "${v.nome}" cadastrado.`)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar lead' : 'Novo lead'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Atualize os dados do lead.' : 'Cadastre manualmente um lead captado fora do funil automático.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField control={form.control} name="nome" render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl><Input placeholder="Ex: João Silva" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="telefone" render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl><Input placeholder="(00) 00000-0000" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="origem" render={({ field }) => (
                <FormItem>
                  <FormLabel>Origem</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {CANAIS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="score" render={({ field }) => (
                <FormItem>
                  <FormLabel>Score</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      {SCORES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="campanhaId" render={({ field }) => (
              <FormItem>
                <FormLabel>Campanha de origem</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value={SEM_CAMPANHA}>Nenhuma (orgânico)</SelectItem>
                    {CAMPANHAS.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="consentimento" render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <FormLabel>Consentimento LGPD (opt-in)</FormLabel>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit">{isEdit ? 'Salvar alterações' : 'Cadastrar lead'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
