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
import { buildClienteColumns } from './cliente-columns'
import { ClienteFormDialog } from './cliente-form-dialog'
import { CLIENTES } from './mock-data'
import type { Cliente } from './types'
import type { ClienteFormValues } from './cliente-schema'

export function ClientesTab() {
  const [clientes, setClientes] = useState<Cliente[]>(CLIENTES)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Cliente | null>(null)
  const [deleting, setDeleting] = useState<Cliente | null>(null)

  function handleNew() {
    setEditing(null)
    setFormOpen(true)
  }

  function handleEdit(c: Cliente) {
    setEditing(c)
    setFormOpen(true)
  }

  function handleSubmit(values: ClienteFormValues) {
    if (editing) {
      setClientes((prev) => prev.map((c) => (c.id === editing.id ? { ...c, ...values } : c)))
    } else {
      setClientes((prev) => [
        { id: Math.max(0, ...prev.map((c) => c.id)) + 1, ...values },
        ...prev,
      ])
    }
  }

  function confirmDelete() {
    if (!deleting) return
    setClientes((prev) => prev.filter((c) => c.id !== deleting.id))
    toast.success(`Cliente "${deleting.nome}" excluído.`)
    setDeleting(null)
  }

  const columns = useMemo(
    () => buildClienteColumns({ onEdit: handleEdit, onDelete: setDeleting }),
    [],
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={clientes}
        searchPlaceholder="Buscar cliente, e-mail, cidade..."
        emptyMessage="Nenhum cliente cadastrado."
        toolbar={
          <Button onClick={handleNew}>
            <Plus className="size-4" />
            Novo cliente
          </Button>
        }
      />

      <ClienteFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        cliente={editing}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={Boolean(deleting)} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação removerá <strong>{deleting?.nome}</strong>. Não pode ser desfeita.
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
