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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ROLE_OPTIONS } from '@/lib/roles'
import type { AccessRole } from '@/types'
import { userSchema, type UserFormValues } from './user-schema'
import type { SystemUser } from './types'
import { UNIDADES } from './mock-data'

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Usuário em edição; ausente = criação. */
  user?: SystemUser | null
  onSubmit: (values: UserFormValues) => void
}

const EMPTY: UserFormValues = {
  name: '',
  email: '',
  unidade: '',
  roles: [],
  status: 'ativo',
}

export function UserFormDialog({ open, onOpenChange, user, onSubmit }: UserFormDialogProps) {
  const isEdit = Boolean(user)
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: EMPTY,
  })

  // Recarrega os valores ao abrir/trocar de usuário.
  useEffect(() => {
    if (open) {
      form.reset(
        user
          ? {
              name: user.name,
              email: user.email,
              unidade: user.unidade,
              roles: user.roles,
              status: user.status,
            }
          : EMPTY,
      )
    }
  }, [open, user, form])

  function handleSubmit(values: UserFormValues) {
    onSubmit(values)
    toast.success(isEdit ? 'Usuário atualizado.' : 'Usuário criado.')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar usuário' : 'Novo usuário'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize os dados e os papéis de acesso.'
              : 'Cadastre um usuário e atribua os papéis de acesso ao sistema.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Marina Alves" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="voce@studiokasa.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {UNIDADES.map((u) => (
                          <SelectItem key={u} value={u}>
                            {u}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="roles"
              render={() => (
                <FormItem>
                  <FormLabel>Papéis de acesso</FormLabel>
                  <FormDescription>Definem o que o usuário pode acessar no sistema.</FormDescription>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {ROLE_OPTIONS.map((role) => (
                      <FormField
                        key={role.value}
                        control={form.control}
                        name="roles"
                        render={({ field }) => {
                          const checked = field.value?.includes(role.value)
                          return (
                            <FormItem className="flex items-center gap-2 space-y-0 rounded-lg border p-2.5">
                              <FormControl>
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(value) => {
                                    const next = value
                                      ? [...field.value, role.value]
                                      : field.value.filter((r: AccessRole) => r !== role.value)
                                    field.onChange(next)
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="cursor-pointer text-sm font-normal">
                                {role.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <FormLabel>Usuário ativo</FormLabel>
                    <FormDescription>Inativos não conseguem fazer login.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value === 'ativo'}
                      onCheckedChange={(v) => field.onChange(v ? 'ativo' : 'inativo')}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">{isEdit ? 'Salvar alterações' : 'Criar usuário'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
