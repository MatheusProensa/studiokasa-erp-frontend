import type { StatusTone } from '@/components/ui/status-badge'

/** Modelos de documento fiscal. */
export type NotaModelo = 'NF-e' | 'NFC-e' | 'NFS-e'
export const MODELO_INFO: Record<NotaModelo, string> = {
  'NF-e': 'Modelo 55 — venda do móvel',
  'NFC-e': 'Venda presencial de avulsos',
  'NFS-e': 'Serviço puro (montagem/assistência)',
}

/** Status da nota junto à SEFAZ. */
export type NotaStatus = 'autorizada' | 'processando' | 'rejeitada' | 'cancelada'
export const STATUS_META: Record<NotaStatus, { label: string; tone: StatusTone }> = {
  autorizada: { label: 'Autorizada', tone: 'success' },
  processando: { label: 'Processando', tone: 'info' },
  rejeitada: { label: 'Rejeitada', tone: 'danger' },
  cancelada: { label: 'Cancelada', tone: 'neutral' },
}
