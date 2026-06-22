import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { DataTable } from '@/components/data-table/data-table'
import { formatDateTime } from '@/lib/format'

interface LogEntry {
  id: number
  usuario: string
  acao: string
  modulo: string
  quando: string
  tone: 'success' | 'warning' | 'danger' | 'info'
}

const LOGS: LogEntry[] = [
  { id: 1, usuario: 'Marina Alves', acao: 'Criou usuário "Juliana Costa"', modulo: 'Administração', quando: '2026-06-21T08:40:00', tone: 'success' },
  { id: 2, usuario: 'Carlos Dias', acao: 'Atualizou perfil "Atendimento"', modulo: 'Permissões', quando: '2026-06-21T06:10:00', tone: 'info' },
  { id: 3, usuario: 'Paulo Mendes', acao: 'Alterou permissão de "Carlos Dias"', modulo: 'Permissões', quando: '2026-06-20T22:00:00', tone: 'info' },
  { id: 4, usuario: 'Beatriz Souza', acao: 'Excluiu usuário "Diego Faria"', modulo: 'Administração', quando: '2026-06-20T17:35:00', tone: 'danger' },
  { id: 5, usuario: 'Sônia Prado', acao: 'Alterou política de senha', modulo: 'Administração', quando: '2026-06-19T14:05:00', tone: 'warning' },
  { id: 6, usuario: 'André Lima', acao: 'Login realizado', modulo: 'Sistema', quando: '2026-06-19T08:02:00', tone: 'success' },
  { id: 7, usuario: 'Helena Castro', acao: 'Tentativa de login falhou (senha incorreta)', modulo: 'Sistema', quando: '2026-06-18T19:48:00', tone: 'danger' },
  { id: 8, usuario: 'Renata Vargas', acao: 'Atualizou política de desconto', modulo: 'Administração', quando: '2026-06-18T11:20:00', tone: 'warning' },
]

const TONE_LABEL: Record<LogEntry['tone'], string> = {
  success: 'Sucesso',
  info: 'Info',
  warning: 'Alteração',
  danger: 'Crítico',
}

export function LogsTab() {
  const columns = useMemo<ColumnDef<LogEntry>[]>(() => [
    { accessorKey: 'usuario', header: 'Usuário', cell: ({ row }) => <span className="font-medium">{row.original.usuario}</span> },
    { accessorKey: 'acao', header: 'Ação' },
    { accessorKey: 'modulo', header: 'Módulo', cell: ({ row }) => <span className="text-muted-foreground">{row.original.modulo}</span> },
    {
      accessorKey: 'tone',
      header: 'Tipo',
      cell: ({ row }) => <StatusBadge tone={row.original.tone}>{TONE_LABEL[row.original.tone]}</StatusBadge>,
    },
    {
      accessorKey: 'quando',
      header: 'Quando',
      cell: ({ row }) => <span className="text-muted-foreground">{formatDateTime(row.original.quando)}</span>,
    },
  ], [])

  return (
    <DataTable
      columns={columns}
      data={LOGS}
      searchPlaceholder="Buscar por usuário, ação ou módulo..."
      emptyMessage="Nenhum registro encontrado."
    />
  )
}
