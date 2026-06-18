import type { EstoqueItem, InventarioLinha, Movimento } from './types'

export const ITENS: EstoqueItem[] = [
  { id: 1, sku: 'AC-CO450', nome: 'Corrediça telescópica 450mm', categoria: 'acessorio', saldo: 12, minimo: 40, endereco: 'Rua A · N3 · P12', status: 'disponivel', lote: 'L-2406', filial: 'CD Logística' },
  { id: 2, sku: 'AC-DB01', nome: 'Dobradiça curva', categoria: 'acessorio', saldo: 30, minimo: 100, endereco: 'Rua A · N2 · P05', status: 'disponivel', lote: 'L-2405', filial: 'CD Logística' },
  { id: 3, sku: 'PA-COZ42', nome: 'Cozinha Helena Moretti (kit)', categoria: 'acabado', saldo: 1, minimo: 0, endereco: 'Doca 2 · Box 8', status: 'reservado', lote: 'PRJ-0042', filial: 'CD Logística' },
  { id: 4, sku: 'PA-DOR44', nome: 'Dormitório Rafael Nunes (kit)', categoria: 'acabado', saldo: 1, minimo: 0, endereco: 'Doca 1 · Box 3', status: 'em-transito', lote: 'PRJ-0044', filial: 'CD Logística' },
  { id: 5, sku: 'AC-PF440', nome: 'Parafuso 4x40 (cento)', categoria: 'acessorio', saldo: 5, minimo: 20, endereco: 'Rua B · N1 · P02', status: 'disponivel', lote: 'L-2403', filial: 'CD Logística' },
  { id: 6, sku: 'AC-FBTX', nome: 'Fita de borda Branco TX', categoria: 'acessorio', saldo: 80, minimo: 200, endereco: 'Rua B · N2 · P09', status: 'disponivel', lote: 'L-2406', filial: 'CD Logística' },
  { id: 7, sku: 'AC-PUX12', nome: 'Puxador perfil 1,2m', categoria: 'acessorio', saldo: 140, minimo: 60, endereco: 'Rua C · N1 · P01', status: 'disponivel', lote: 'L-2404', filial: 'Matriz' },
]

export const MOVIMENTOS: Movimento[] = [
  { id: 1, data: '2026-06-16T10:20:00', tipo: 'entrada', sku: 'AC-PUX12', item: 'Puxador perfil 1,2m', qtd: 100, ref: 'PC-2001' },
  { id: 2, data: '2026-06-16T14:05:00', tipo: 'saida', sku: 'AC-DB01', item: 'Dobradiça curva', qtd: 24, ref: 'OS-1009' },
  { id: 3, data: '2026-06-15T09:40:00', tipo: 'entrada', sku: 'PA-DOR44', item: 'Dormitório Rafael Nunes (kit)', qtd: 1, ref: 'PC-2001' },
  { id: 4, data: '2026-06-14T16:30:00', tipo: 'transferencia', sku: 'AC-PUX12', item: 'Puxador perfil 1,2m', qtd: 40, ref: 'Matriz → CD' },
]

export const INVENTARIO: InventarioLinha[] = [
  { sku: 'AC-CO450', item: 'Corrediça telescópica 450mm', sistema: 12, fisico: 12 },
  { sku: 'AC-DB01', item: 'Dobradiça curva', sistema: 30, fisico: 28 },
  { sku: 'AC-PF440', item: 'Parafuso 4x40 (cento)', sistema: 5, fisico: 6 },
  { sku: 'AC-FBTX', item: 'Fita de borda Branco TX', sistema: 80, fisico: 80 },
]
