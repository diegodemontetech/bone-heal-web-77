# Supabase Edge Functions - Bone Heal Web

## Visão Geral
Este diretório contém as Edge Functions do Supabase utilizadas pelo Bone Heal Web. Estas funções são essenciais para a integração com o Mercado Pago e processamento de pagamentos.

## Lista de Edge Functions
- **test-mercadopago**: Testa a conectividade com a API do Mercado Pago
- **mercadopago-webhook**: Processa webhooks do Mercado Pago
- **check-payment**: Verifica status de pagamentos
- **create-payment**: Cria novas ordens de pagamento

## Como fazer deploy para produção

### Pré-requisitos
1. CLI do Supabase instalada
2. Login feito na CLI do Supabase
3. Variáveis de ambiente configuradas corretamente

### Passos para deploy

#### 1. Login no Supabase
```bash
npx supabase login
```

#### 2. Deploy de uma função específica
```bash
cd /root/bone-heal-web
npx supabase functions deploy test-mercadopago --project-ref kurpshcdafxbyqnzxvxu
```

#### 3. Deploy de todas as functions
```bash
cd /root/bone-heal-web
npx supabase functions deploy --project-ref kurpshcdafxbyqnzxvxu
```

### Variáveis de ambiente necessárias
Certifique-se de que as seguintes variáveis estejam configuradas:

```bash
# Para configurar variáveis de ambiente
npx supabase secrets set MP_ACCESS_TOKEN="seu_token_mercado_pago" --project-ref kurpshcdafxbyqnzxvxu
npx supabase secrets set SUPABASE_URL="https://kurpshcdafxbyqnzxvxu.supabase.co" --project-ref kurpshcdafxbyqnzxvxu
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY="sua_chave_service_role" --project-ref kurpshcdafxbyqnzxvxu
```

## Testando localmente

Para testar as Edge Functions localmente antes do deploy, execute:

```bash
npx supabase start
npx supabase functions serve test-mercadopago
```

## Testando após o deploy

Após o deploy, você pode verificar se a função está funcionando corretamente acessando:

```
https://kurpshcdafxbyqnzxvxu.supabase.co/functions/v1/test-mercadopago
```

Ou usando a página de testes no painel admin:

```
https://boneheal.com.br/admin/test-mercadopago
```

## Resolvendo problemas comuns

### Erro na Edge Function test-mercadopago

Se a função `test-mercadopago` estiver retornando erros, verifique:

1. **Token do Mercado Pago**: Certifique-se de que o token está configurado corretamente
2. **Permissões CORS**: Verifique se as permissões CORS estão configuradas corretamente
3. **Formato da resposta**: Verifique se a resposta está no formato esperado pelo frontend

### Valores de Frete não são carregados

Se os valores de frete não estiverem sendo carregados corretamente, verifique:

1. **CEP do usuário**: Certifique-se de que o CEP está sendo carregado corretamente do perfil
2. **Hook useShipping**: Verifique os logs para garantir que o hook está funcionando corretamente

## Notas importantes
- Sempre teste as functions localmente antes de fazer deploy para produção.
- Para funções que manipulam pagamentos, garanta que estejam corretamente configuradas para o ambiente de produção (não em modo de teste).
- As alterações recentes corrigiram problemas no carregamento de CEP, exibição de imagens em miniatura e tratamento de erros nas Edge Functions.
