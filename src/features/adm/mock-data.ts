import type { SystemUser } from './types'

/** Usuários de exemplo (mock). Ao plugar no Laravel, virá de GET /adm/usuarios. */
export const MOCK_USERS: SystemUser[] = [
  { id: 1, name: 'Marina Alves', email: 'marina@studiokasa.com', roles: ['projetista'], status: 'ativo', unidade: 'Loja Centro', lastAccess: '2026-06-17T11:20:00' },
  { id: 2, name: 'Carlos Dias', email: 'carlos@studiokasa.com', roles: ['vendedor', 'supervisor'], status: 'ativo', unidade: 'Loja Centro', lastAccess: '2026-06-17T09:05:00' },
  { id: 3, name: 'Rui Pena', email: 'rui@studiokasa.com', roles: ['vendedor'], status: 'ativo', unidade: 'Loja Norte', lastAccess: '2026-06-16T17:42:00' },
  { id: 4, name: 'Beatriz Souza', email: 'beatriz@studiokasa.com', roles: ['financeiro'], status: 'ativo', unidade: 'Matriz', lastAccess: '2026-06-17T08:30:00' },
  { id: 5, name: 'André Lima', email: 'andre@studiokasa.com', roles: ['estoquista'], status: 'ativo', unidade: 'CD Logística', lastAccess: '2026-06-15T14:10:00' },
  { id: 6, name: 'Helena Castro', email: 'helena@studiokasa.com', roles: ['conferente'], status: 'inativo', unidade: 'CD Logística', lastAccess: '2026-05-28T10:00:00' },
  { id: 7, name: 'Paulo Mendes', email: 'paulo@studiokasa.com', roles: ['gerente'], status: 'ativo', unidade: 'Matriz', lastAccess: '2026-06-17T07:55:00' },
  { id: 8, name: 'Renata Vargas', email: 'renata@studiokasa.com', roles: ['marketing'], status: 'ativo', unidade: 'Matriz', lastAccess: '2026-06-16T19:20:00' },
  { id: 9, name: 'Diego Faria', email: 'diego@studiokasa.com', roles: ['projetista'], status: 'inativo', unidade: 'Loja Norte', lastAccess: null },
  { id: 10, name: 'Sônia Prado', email: 'sonia@studiokasa.com', roles: ['diretor'], status: 'ativo', unidade: 'Matriz', lastAccess: '2026-06-17T10:48:00' },
  { id: 11, name: 'Tiago Rocha', email: 'tiago@studiokasa.com', roles: ['vendedor'], status: 'ativo', unidade: 'Loja Sul', lastAccess: '2026-06-14T12:15:00' },
  { id: 12, name: 'Luiza Antunes', email: 'luiza@studiokasa.com', roles: ['supervisor'], status: 'ativo', unidade: 'Loja Sul', lastAccess: '2026-06-17T09:40:00' },
]

export const UNIDADES = ['Matriz', 'Loja Centro', 'Loja Norte', 'Loja Sul', 'CD Logística']
