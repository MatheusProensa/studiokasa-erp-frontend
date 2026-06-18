/**
 * Conteúdo de ajuda contextual ("Como usar esta tela") por rota.
 * Linguagem simples, passos com verbo de ação — no espírito dos POPs da loja.
 * Didático para quem nunca usou o sistema.
 */
export interface HelpContent {
  titulo: string
  intro: string
  passos: string[]
  dica?: string
}

export const HELP: Record<string, HelpContent> = {
  '/': {
    titulo: 'Dashboard',
    intro: 'Visão geral do dia a dia da loja.',
    passos: [
      'Veja os números do mês nos cartões do topo (vendas, projetos, estoque, a receber).',
      'Acompanhe os projetos recentes e o status de cada um na tabela.',
      'Confira a agenda da semana (medições, entregas e montagens) à direita.',
    ],
    dica: 'Use Ctrl+K a qualquer momento para buscar e pular entre módulos.',
  },
  '/crm': {
    titulo: 'CRM e Vendas',
    intro: 'Acompanhe leads e negociações do primeiro contato até o fechamento.',
    passos: [
      'Na aba Funil, arraste o card do cliente entre as etapas conforme a venda avança.',
      'Use a aba Oportunidades para ver tudo em lista e a aba Clientes para o cadastro.',
      'Em Clientes, abra o menu (⋯) e clique em "Ver projetos" para ir aos projetos daquele cliente.',
    ],
    dica: 'O desconto que você pode dar depende do seu perfil (alçada definida na Administração).',
  },
  '/projetos': {
    titulo: 'Gestão de Projetos',
    intro: 'Acompanhe cada ambiente da venda à montagem.',
    passos: [
      'No Quadro, arraste o projeto entre as etapas (Projeto → Medição → Técnico → Produção → Montagem).',
      'Clique num card para abrir a ficha com versões e a lista de peças.',
      'Use "Aprovar projeto" na ficha quando o cliente confirmar.',
    ],
  },
  '/medicao': {
    titulo: 'Medição e Conferência',
    intro: 'Agende e confira as medições no local.',
    passos: [
      'Clique em "Agendar medição" e informe cliente, tipo (preliminar/final) e conferente.',
      'Abra a medição, faça o check-in e marque os itens do checklist.',
      'Registre o valor conferido e aprove — se a divergência passar do limite, será preciso liberar por alçada.',
    ],
    dica: 'Só a medição FINAL aprovada libera o pedido ao fornecedor.',
  },
  '/pedidos': {
    titulo: 'Pedido ao Fornecedor',
    intro: 'Acompanhe a produção terceirizada.',
    passos: [
      'Crie o pedido a partir do projeto aprovado em "Novo pedido".',
      'Abra o pedido e use "Avançar" para mudar o status (produção → pronto → despachado → recebido).',
      'Registre divergências (peça errada/faltante/avariada) na ficha do pedido.',
    ],
  },
  '/compras': {
    titulo: 'Compras e Suprimentos',
    intro: 'Cote preços e reponha materiais.',
    passos: [
      'Em Cotações, abra "Comparar" e escolha a melhor proposta (preço × prazo).',
      'Veja em Sugestões os itens abaixo do mínimo e gere a cotação.',
      'Consulte o Histórico de preços antes de fechar a compra.',
    ],
  },
  '/estoque': {
    titulo: 'Estoque e Almoxarifado',
    intro: 'Controle saldo, endereço e movimentações.',
    passos: [
      'Veja o saldo e a localização de cada item na aba Itens.',
      'Clique em "Movimentação" para dar entrada, saída ou transferência.',
      'Toda movimentação aparece no Kardex; use o Inventário para conferir físico × sistema.',
    ],
    dica: 'Itens abaixo do mínimo aparecem destacados em vermelho.',
  },
  '/financeiro': {
    titulo: 'Financeiro',
    intro: 'Contas a pagar, a receber, comissões e caixa.',
    passos: [
      'Nas abas A receber / A pagar, use "Baixar/Pagar" para quitar um título.',
      'Em Comissões, libere e pague conforme a regra (após assinatura/conclusão).',
      'Acompanhe o Fluxo de caixa (realizado × previsto) na última aba.',
    ],
  },
  '/fiscal': {
    titulo: 'Fiscal e Contábil',
    intro: 'Notas emitidas, entradas e tributos.',
    passos: [
      'Abra uma nota para ver o detalhamento de impostos (incluindo IBS/CBS da Reforma).',
      'Retransmita notas rejeitadas ou cancele autorizadas pela ficha.',
      'Em Entradas, escriture a NF-e do fornecedor para aproveitar o crédito.',
    ],
  },
  '/logistica': {
    titulo: 'Logística e Montagem',
    intro: 'Organize entregas e montagens.',
    passos: [
      'Abra a ordem de serviço e faça check-in/check-out da equipe.',
      'Siga o checklist por fase (Entrega → Pré-montagem → Pós-montagem).',
      'Registre avarias na obra direto na ficha.',
    ],
  },
  '/posvenda': {
    titulo: 'Pós-venda e Assistência',
    intro: 'Atenda chamados e acompanhe garantias.',
    passos: [
      'Abra o chamado, inicie o atendimento e, se precisar, solicite reposição de peça.',
      'Encerre o chamado quando resolvido.',
      'Acompanhe as garantias e o NPS nas outras abas.',
    ],
  },
  '/marketing': {
    titulo: 'Marketing',
    intro: 'Campanhas e captação de leads.',
    passos: [
      'Acompanhe o desempenho e o CAC de cada campanha.',
      'Em Leads, envie um lead qualificado para o CRM.',
      'Só é possível enviar leads com consentimento (opt-in LGPD).',
    ],
  },
  '/bi': {
    titulo: 'BI e Dashboards',
    intro: 'Indicadores gerenciais consolidados.',
    passos: [
      'Veja os KPIs do topo (conversão, ticket médio, margem, inadimplência).',
      'Acompanhe vendas por mês, ranking de vendedores e curva ABC de clientes.',
      'Os indicadores de terceirização mostram prazo e OTIF dos fornecedores.',
    ],
  },
  '/portal': {
    titulo: 'Portal do Cliente',
    intro: 'A visão que o cliente tem do projeto dele.',
    passos: [
      'Acompanhe a jornada do projeto (contrato → montagem).',
      'Confirme agendas e aprove etapas pendentes.',
      'Baixe documentos e abra um chamado de assistência se precisar.',
    ],
  },
  '/rh': {
    titulo: 'RH e Pessoas',
    intro: 'Colaboradores, parceiros e ponto.',
    passos: [
      'Consulte colaboradores ativos e os parceiros terceirizados (montadores/entregadores).',
      'Veja a comissão do mês de cada parceiro.',
      'Acompanhe o resumo de ponto do dia nos cartões do topo.',
    ],
  },
  '/adm': {
    titulo: 'Administração',
    intro: 'Configuração do sistema.',
    passos: [
      'Cadastre usuários e atribua os papéis de acesso na aba Usuários.',
      'Defina o que cada papel pode fazer na matriz de Permissões.',
      'Ajuste parâmetros fiscais e a política de desconto nas outras abas.',
    ],
    dica: 'O papel do usuário define quais telas ele vê no menu lateral.',
  },
}
