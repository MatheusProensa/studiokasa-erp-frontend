import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { DataTable } from '@/components/data-table/data-table'
import { formatDate } from '@/lib/format'
import { CotacaoDetailSheet } from './cotacao-detail-sheet'
import type { Cotacao } from './types'
import { PEDIDOS } from '@/features/pedidos/mock-data'

export function CotacoesTab({ cotacoes, onCotacoesChange }: {
  cotacoes: Cotacao[]
  onCotacoesChange: (cotacoes: Cotacao[]) => void
}) {
  const [detail, setDetail] = useState<Cotacao | null>(null)

  function escolher(cotacaoId: number, fornecedor: string) {
    const cotacao = cotacoes.find((c) => c.id === cotacaoId)
    const proposta = cotacao?.propostas.find((p) => p.fornecedor === fornecedor)

    onCotacoesChange(
      cotacoes.map((c) =>
        c.id !== cotacaoId
          ? c
          : {
              ...c,
              status: 'fechada',
              propostas: c.propostas.map((p) => ({ ...p, vencedora: p.fornecedor === fornecedor })),
            },
      ),
    )
    // mantém o sheet em sincronia
    setDetail((d) =>
      d && d.id === cotacaoId
        ? {
            ...d,
            status: 'fechada',
            propostas: d.propostas.map((p) => ({ ...p, vencedora: p.fornecedor === fornecedor })),
          }
        : d,
    )

    if (cotacao && proposta) {
      const novoId = Math.max(0, ...PEDIDOS.map((p) => p.id)) + 1
      const prazo = new Date(Date.now() + proposta.prazoDias * 86400000).toISOString().slice(0, 10)
      PEDIDOS.unshift({
        id: novoId,
        codigo: `PC-${2000 + novoId}`,
        projeto: '—',
        ambiente: cotacao.descricao,
        fornecedor,
        status: 'em-producao',
        prazoEntrega: prazo,
        valor: proposta.valorTotal,
        itens: cotacao.itens.map((nome) => ({ nome, qtd: 1 })),
        divergencias: [],
      })
    }

    toast.success(`Pedido de compra gerado para ${fornecedor} — confira em Pedido ao Fornecedor.`)
  }

  const columns = useMemo<ColumnDef<Cotacao>[]>(
    () => [
      {
        accessorKey: 'codigo',
        header: 'Cotação',
        cell: ({ row }) => <Badge variant="outline">{row.original.codigo}</Badge>,
      },
      {
        accessorKey: 'descricao',
        header: 'Descrição',
        cell: ({ row }) => <span className="font-medium">{row.original.descricao}</span>,
      },
      {
        id: 'itens',
        header: 'Itens',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.itens.length}</span>,
      },
      {
        id: 'propostas',
        header: 'Propostas',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.propostas.length}</span>,
      },
      {
        accessorKey: 'criadaEm',
        header: 'Criada em',
        cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.criadaEm)}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <StatusBadge tone={row.original.status === 'fechada' ? 'success' : 'info'}>
            {row.original.status === 'fechada' ? 'Fechada' : 'Aberta'}
          </StatusBadge>
        ),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="text-right">
            <Button variant="outline" size="sm" onClick={() => setDetail(row.original)}>
              Comparar
            </Button>
          </div>
        ),
      },
    ],
    [],
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={cotacoes}
        searchPlaceholder="Buscar cotação..."
        emptyMessage="Nenhuma cotação."
      />
      <CotacaoDetailSheet
        cotacao={detail}
        onOpenChange={(o) => !o && setDetail(null)}
        onEscolher={escolher}
      />
    </>
  )
}
