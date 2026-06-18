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
import { FORNECEDORES } from './constants'
import { usePedidos } from './pedidos-context'

const schema = z.object({
  projeto: z.string().min(2, 'Informe o projeto.'),
  ambiente: z.string().min(2, 'Informe o ambiente.'),
  fornecedor: z.string().min(1, 'Selecione o fornecedor.'),
  prazoEntrega: z.string().min(1, 'Informe o prazo.'),
  valor: z.number().min(0, 'Valor inválido.'),
})

type Values = z.infer<typeof schema>

const EMPTY: Values = { projeto: '', ambiente: '', fornecedor: '', prazoEntrega: '', valor: 0 }

export function NovoPedidoDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const { criarPedido } = usePedidos()
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: EMPTY })

  useEffect(() => {
    if (open) form.reset(EMPTY)
  }, [open, form])

  function handleSubmit(v: Values) {
    criarPedido(v)
    toast.success('Pedido enviado ao fornecedor.')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo pedido ao fornecedor</DialogTitle>
          <DialogDescription>
            Gerado a partir de um projeto com medição final aprovada.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="projeto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Projeto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: PRJ-0042" {...field} />
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

            <FormField
              control={form.control}
              name="fornecedor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fornecedor</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FORNECEDORES.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
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
                name="prazoEntrega"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prazo de entrega</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
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
              <Button type="submit">Enviar pedido</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
