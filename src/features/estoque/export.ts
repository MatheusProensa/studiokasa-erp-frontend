import { CATEGORIA_LABEL, ITEM_STATUS_META } from './constants'
import { NIVEL_LABEL, itemNivel } from './level'
import type { EstoqueItem } from './types'

/** Exporta a lista de itens em CSV (abre no Excel). */
export function exportarCSV(itens: EstoqueItem[]) {
  const head = ['SKU', 'Item', 'Categoria', 'Saldo', 'Mínimo', 'Nível', 'Endereço', 'Lote', 'Filial', 'Status']
  const linhas = itens.map((i) => [
    i.sku,
    i.nome,
    CATEGORIA_LABEL[i.categoria],
    i.saldo,
    i.minimo,
    NIVEL_LABEL[itemNivel(i)],
    i.endereco,
    i.lote,
    i.filial,
    ITEM_STATUS_META[i.status].label,
  ])
  const csv = [head, ...linhas]
    .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';'))
    .join('\n')

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `estoque-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
