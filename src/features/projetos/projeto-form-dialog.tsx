import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { ETAPAS, SOFTWARES_3D } from './constants'
import { PROJETISTAS } from './mock-data'
import { projetoSchema, type ProjetoSchemaValues } from './projeto-schema'
import { useProjetos, type ProjetoFormValues } from './projetos-context'
import type { Projeto } from './types'

interface ProjetoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projeto?: Projeto | null
}

const EMPTY: ProjetoSchemaValues = {
  cliente: '',
  ambiente: '',
  projetista: '',
  etapa: 'projeto',
  valor: 0,
  software: 'Promob',
}

export function ProjetoFormDialog({ open, onOpenChange, projeto }: ProjetoFormDialogProps) {
  const { salvar } = useProjetos()
  const isEdit = Boolean(projeto)
  const form = useForm<ProjetoSchemaValues>({
    resolver: zodResolver(projetoSchema),
    defaultValues: EMPTY,
  })

  useEffect(() => {
    if (open) {
      form.reset(
        projeto
          ? {
              cliente: projeto.cliente,
              ambiente: projeto.ambiente,
              projetista: projeto.projetista,
              etapa: projeto.etapa,
              valor: projeto.valor,
              software: projeto.software,
            }
          : EMPTY,
      )
    }
  }, [open, projeto, form])

  function handleSubmit(values: ProjetoSchemaValues) {
    salvar(values as ProjetoFormValues, projeto?.id)
    toast.success(isEdit ? 'Projeto atualizado.' : 'Projeto criado.')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar projeto' : 'Novo projeto'}</DialogTitle>
          <DialogDescription>Vincule projeto, cliente e projetista.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                name="projetista"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Projetista</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROJETISTAS.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="software"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Software 3D</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SOFTWARES_3D.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
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
                name="etapa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etapa</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ETAPAS.map((e) => (
                          <SelectItem key={e.key} value={e.key}>
                            {e.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
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
              <Button type="submit">{isEdit ? 'Salvar alterações' : 'Criar projeto'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
