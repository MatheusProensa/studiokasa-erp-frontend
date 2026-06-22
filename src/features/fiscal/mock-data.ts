import type { NotaEntrada, NotaFiscal } from './types'

export const NOTAS: NotaFiscal[] = [
  {
    id: 1,
    numero: '000.001.245',
    modelo: 'NF-e',
    cliente: 'Rafael Nunes',
    ambiente: 'Dormitório casal',
    valor: 23900,
    emitidaEm: '2026-06-17T10:12:00',
    status: 'autorizada',
    impostos: { icms: 4302, pis: 394, cofins: 1817, ibs: 2151, cbs: 1912 },
  },
  {
    id: 2,
    numero: '000.001.246',
    modelo: 'NF-e',
    cliente: 'Helena Moretti',
    ambiente: 'Cozinha planejada',
    valor: 42800,
    emitidaEm: '2026-06-17T14:40:00',
    status: 'processando',
    impostos: { icms: 7704, pis: 706, cofins: 3253, ibs: 3852, cbs: 3424 },
  },
  {
    id: 3,
    numero: '000.001.244',
    modelo: 'NFC-e',
    cliente: 'Consumidor (balcão)',
    ambiente: 'Acessórios avulsos',
    valor: 480,
    emitidaEm: '2026-06-16T16:05:00',
    status: 'autorizada',
    impostos: { icms: 86, pis: 8, cofins: 36, ibs: 43, cbs: 38 },
  },
  {
    id: 4,
    numero: '000.001.243',
    modelo: 'NF-e',
    cliente: 'Construtora Vega Ltda',
    ambiente: 'Home office (12 un.)',
    valor: 158200,
    emitidaEm: '2026-06-15T09:20:00',
    status: 'rejeitada',
    impostos: { icms: 28476, pis: 2610, cofins: 12023, ibs: 14238, cbs: 12656 },
  },
  {
    id: 5,
    numero: '000.001.240',
    modelo: 'NFS-e',
    cliente: 'Ana Beatriz Souza',
    ambiente: 'Assistência — ajuste de portas',
    valor: 350,
    emitidaEm: '2026-06-12T11:00:00',
    status: 'cancelada',
    impostos: { icms: 0, pis: 6, cofins: 27, ibs: 0, cbs: 28 },
  },
]

export const ENTRADAS: NotaEntrada[] = [
  { id: 1, numero: '000.008.842', fornecedor: 'MDF Premium Ind.', valor: 23400, credito: 4212, emitidaEm: '2026-06-08T00:00:00', escriturada: true },
  { id: 2, numero: '000.001.190', fornecedor: 'Componentes RS', valor: 8420, credito: 1515, emitidaEm: '2026-06-15T00:00:00', escriturada: false },
  { id: 3, numero: '000.004.501', fornecedor: 'Fábrica Móveis Sul', valor: 18900, credito: 3402, emitidaEm: '2026-06-10T00:00:00', escriturada: true },
]

/** Certificado digital A1 (mock). */
export const CERTIFICADO = {
  titular: 'STUDIOKASA AMBIENTES LTDA',
  cnpj: '12.345.678/0001-90',
  tipo: 'A1',
  validade: '2026-09-30',
}
