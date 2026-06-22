import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table/data-table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { buildUserColumns } from './user-columns'
import { UserFormDialog } from './user-form-dialog'
import type { SystemUser } from './types'
import type { UserFormValues } from './user-schema'

export function UsuariosTab({ users, onUsersChange }: {
  users: SystemUser[]
  onUsersChange: (users: SystemUser[]) => void
}) {
  const setUsers = (updater: (prev: SystemUser[]) => SystemUser[]) => onUsersChange(updater(users))
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<SystemUser | null>(null)
  const [deleting, setDeleting] = useState<SystemUser | null>(null)

  function handleNew() {
    setEditing(null)
    setFormOpen(true)
  }

  function handleEdit(user: SystemUser) {
    setEditing(user)
    setFormOpen(true)
  }

  function handleSubmit(values: UserFormValues) {
    if (editing) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editing.id ? { ...u, ...values } : u)),
      )
    } else {
      setUsers((prev) => [
        { id: Math.max(0, ...prev.map((u) => u.id)) + 1, lastAccess: null, ...values },
        ...prev,
      ])
    }
  }

  function confirmDelete() {
    if (!deleting) return
    setUsers((prev) => prev.filter((u) => u.id !== deleting.id))
    toast.success(`Usuário "${deleting.name}" excluído.`)
    setDeleting(null)
  }

  const columns = useMemo(
    () => buildUserColumns({ onEdit: handleEdit, onDelete: setDeleting }),
    [],
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={users}
        searchPlaceholder="Buscar por nome, e-mail..."
        emptyMessage="Nenhum usuário cadastrado."
        toolbar={
          <Button onClick={handleNew}>
            <Plus className="size-4" />
            Novo usuário
          </Button>
        }
      />

      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        user={editing}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={Boolean(deleting)} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação removerá <strong>{deleting?.name}</strong> do sistema. Não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
