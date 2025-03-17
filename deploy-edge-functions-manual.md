# Instruções para Deploy Manual das Edge Functions

## Pré-requisitos

1. Certifique-se de ter a CLI do Supabase instalada:
   ```bash
   npm install -g supabase
   ```

2. Tenha o token de acesso do Supabase. Para obtê-lo:
   - Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Faça login na sua conta
   - Clique no seu perfil (canto superior direito)
   - Acesse "API Tokens"
   - Crie um novo token ou copie um existente

## Procedimento de Deploy

1. Faça login no Supabase CLI usando seu token:
   ```bash
   supabase login
   ```
   
   Ou definindo a variável de ambiente:
   ```bash
   export SUPABASE_ACCESS_TOKEN=seu_token_aqui
   ```

2. Clone o repositório (se ainda não tiver feito):
   ```bash
   git clone https://github.com/diegodemontetech/bone-heal-web.git
   cd bone-heal-web
   ```

3. Deploy da função `test-mercadopago`:
   ```bash
   npx supabase functions deploy test-mercadopago --project-ref kurpshcdafxbyqnzxvxu --no-verify-jwt
   ```

4. Configuração das variáveis de ambiente necessárias:
   ```bash
   npx supabase secrets set MP_ACCESS_TOKEN="seu_token_mercado_pago" --project-ref kurpshcdafxbyqnzxvxu
   npx supabase secrets set SUPABASE_URL="https://kurpshcdafxbyqnzxvxu.supabase.co" --project-ref kurpshcdafxbyqnzxvxu
   npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY="sua_chave_service_role" --project-ref kurpshcdafxbyqnzxvxu
   ```

## Teste da função implementada

1. Acesse a função via navegador ou usando o comando `curl`:
   ```bash
   curl -i https://kurpshcdafxbyqnzxvxu.supabase.co/functions/v1/test-mercadopago
   ```

2. A resposta esperada deve incluir informações sobre o status do Mercado Pago.

## Resolução de problemas comuns

1. **Erro de autenticação:** Verifique se o token de acesso está correto e não expirou.

2. **Problemas com variáveis de ambiente:** Assegure-se de que as chaves secretas foram configuradas corretamente usando `supabase secrets set`.

3. **Erros de função:** Verifique os logs da função para identificar possíveis erros:
   ```bash
   npx supabase functions logs test-mercadopago --project-ref kurpshcdafxbyqnzxvxu
   ```

4. **Permissões de JWT:** Se você receber erros relacionados a JWT, considere adicionar a flag `--no-verify-jwt` durante o deploy, mas apenas para funções que não precisam de autenticação:
   ```bash
   npx supabase functions deploy test-mercadopago --project-ref kurpshcdafxbyqnzxvxu --no-verify-jwt
   ```

## Notas importantes

- Lembre-se de não compartilhar suas chaves secretas ou tokens de acesso publicamente
- Mantenha backup das configurações de ambiente antes de fazer qualquer alteração
- Para funções que lidam com dados sensíveis, sempre ative a verificação JWT
