
# BoneHeal Website

## Descrição
Website da BoneHeal, uma empresa especializada em produtos para regeneração óssea. O site inclui catálogo de produtos, blog de notícias, estudos científicos e sistema completo de e-commerce com integração ao Mercado Pago e Omie.

## Tecnologias Utilizadas
- React
- TypeScript
- Tailwind CSS
- Supabase (Backend e Autenticação)
- Mercado Pago (Pagamentos)
- Omie (ERP)

## Funcionalidades Principais
- Catálogo de produtos com detalhes técnicos
- Blog de notícias e estudos científicos
- Carrinho de compras
- Checkout integrado com Mercado Pago
- Área administrativa para:
  - Gerenciamento de produtos
  - Gerenciamento de pedidos
  - Configuração de fretes
  - Gestão de conteúdo (notícias e estudos)
  - Configuração de mensagens WhatsApp
  - Gestão de leads e usuários
  - Sincronização com Omie

## Setup do Projeto

### Requisitos
- Node.js (versão LTS recomendada)
- Conta no Supabase
- Conta no Mercado Pago
- Conta no Omie

### Instalação
1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

### Configuração
1. Configure as credenciais do Supabase
2. Configure o token do Mercado Pago
3. Configure as credenciais do Omie
4. Execute o projeto:
```bash
npm run dev
```

## Estrutura do Projeto
- `/src/components`: Componentes React reutilizáveis
- `/src/pages`: Páginas da aplicação
- `/src/hooks`: Custom hooks
- `/src/integrations`: Integrações com serviços externos
- `/supabase/functions`: Edge Functions do Supabase

## Contribuição
Para contribuir com o projeto:
1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Push para a branch
5. Abra um Pull Request
