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
import { COLABORADORES, type Colaborador } from './mock-data'

const UNIDADES = ['Loja Centro', 'Matriz', 'CD Logística']
const CARGOS = ['Vendedor', 'Projetista', 'Gerente', 'Analista Financeiro', 'Estoquista', 'Conferente', 'Auxiliar Administrativo', 'Supervisor de Vendas']

const schema = z.object({
  nome: z.string().min(3, 'Informe o nome completo.'),
  cargo: z.string().min(1, 'Selecione o cargo.'),
  unidade: z.string().min(1, 'Selecione a unidade.'),
  admissao: z.string().min(1, 'Informe a data de admissão.'),
  nascimento: z.string().optional(),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email('E-mail inválido.').optional().or(z.literal('')),
  endereco: z.string().optional(),
  contatoEmergenciaNome: z.string().optional(),
  contatoEmergenciaTelefone: z.string().optional(),
})

type Values = z.infer<typeof schema>

const EMPTY: Values = {
  nome: '', cargo: '', unidade: '', admissao: '',
  nascimento: '', cpf: '', rg: '', telefone: '', email: '', endereco: '',
  contatoEmergenciaNome: '', contatoEmergenciaTelefone: '',
}

export function ColaboradorFormDialog({ open, onOpenChange, colaborador, onSaved }: {
  open: boolean
  onOpenChange: (o: boolean) => void
  /** Colaborador em edição; ausente = criação. */
  colaborador?: Colaborador | null
  onSaved?: (c: Colaborador) => void
}) {
  const isEdit = Boolean(colaborador)
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: EMPTY })

  useEffect(() => {
    if (open) {
      form.reset(
        colaborador
          ? {
              nome: colaborador.nome,
              cargo: colaborador.cargo,
              unidade: colaborador.unidade,
              admissao: colaborador.admissao,
              nascimento: colaborador.nascimento ?? '',
              cpf: colaborador.cpf ?? '',
              rg: colaborador.rg ?? '',
              telefone: colaborador.telefone ?? '',
              email: colaborador.email ?? '',
              endereco: colaborador.endereco ?? '',
              contatoEmergenciaNome: colaborador.contatoEmergenciaNome ?? '',
              contatoEmergenciaTelefone: colaborador.contatoEmergenciaTelefone ?? '',
            }
          : EMPTY,
      )
    }
  }, [open, colaborador, form])

  function handleSubmit(v: Values) {
    if (isEdit && colaborador) {
      const atualizado: Colaborador = { ...colaborador, ...v }
      const idx = COLABORADORES.findIndex((c) => c.id === colaborador.id)
      if (idx >= 0) COLABORADORES[idx] = atualizado
      onSaved?.(atualizado)
      toast.success(`Dados de ${v.nome} atualizados.`)
    } else {
      const novo: Colaborador = {
        id: Math.max(0, ...COLABORADORES.map((c) => c.id)) + 1,
        ...v,
        ativo: true,
      }
      COLABORADORES.push(novo)
      onSaved?.(novo)
      toast.success(`${v.nome} adicionado(a) com sucesso.`)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar colaborador' : 'Novo Colaborador'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Atualize os dados profissionais e pessoais.' : 'Cadastre um novo membro na equipe.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-muted-foreground">Dados profissionais</p>
              <FormField control={form.control} name="nome" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl><Input placeholder="Ex: João da Silva" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="cargo" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {CARGOS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="unidade" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {UNIDADES.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="admissao" render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de admissão</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="space-y-4 border-t pt-4">
              <p className="text-sm font-semibold text-muted-foreground">Dados pessoais e documentos</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="nascimento" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de nascimento</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
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
                <FormField control={form.control} name="cpf" render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl><Input placeholder="000.000.000-00" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="rg" render={({ field }) => (
                  <FormItem>
                    <FormLabel>RG</FormLabel>
                    <FormControl><Input placeholder="00.000.000-0" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail pessoal</FormLabel>
                  <FormControl><Input type="email" placeholder="nome@exemplo.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="endereco" render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl><Input placeholder="Rua, número — bairro, cidade/UF" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="contatoEmergenciaNome" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contato de emergência</FormLabel>
                    <FormControl><Input placeholder="Nome" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="contatoEmergenciaTelefone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone de emergência</FormLabel>
                    <FormControl><Input placeholder="(00) 00000-0000" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit">{isEdit ? 'Salvar alterações' : 'Cadastrar'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
