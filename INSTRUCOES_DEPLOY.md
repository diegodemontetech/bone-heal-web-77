# Instruções para Deploy no Ambiente de Produção

## Configuração Inicial (Apenas na primeira vez)

1. **Faça login no CLI do Supabase:**
   ```bash
   npx supabase login
   ```
   Será aberta uma página no navegador para autenticação. Após autenticar, você receberá um token para colar no terminal.

2. **Verifique se o login foi bem-sucedido:**
   ```bash
   npx supabase projects list
   ```
   Você deverá ver a lista de projetos, incluindo `kurpshcdafxbyqnzxvxu` (Bone Heal Web).

## Deploy das Edge Functions

### Opção 1: Usando o script automatizado
```bash
cd /root/bone-heal-web/supabase/functions
./deploy-functions.sh
```
Siga as instruções interativas para escolher quais funções deseja implantar.

### Opção 2: Usando comandos diretos

#### Deploy de uma função específica
```bash
cd /root/bone-heal-web
npx supabase functions deploy test-mercadopago --project-ref kurpshcdafxbyqnzxvxu
```

#### Deploy de todas as funções
```bash
cd /root/bone-heal-web
npx supabase functions deploy --project-ref kurpshcdafxbyqnzxvxu
```

## Configuração de Variáveis de Ambiente (se necessário)

Se precisar atualizar as variáveis de ambiente das Edge Functions:

```bash
npx supabase secrets set MP_ACCESS_TOKEN="seu_token_mercado_pago" --project-ref kurpshcdafxbyqnzxvxu
npx supabase secrets set SUPABASE_URL="https://kurpshcdafxbyqnzxvxu.supabase.co" --project-ref kurpshcdafxbyqnzxvxu
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY="sua_chave_service_role" --project-ref kurpshcdafxbyqnzxvxu
```

## Verificação do Deploy

Após o deploy, você pode verificar se a função está funcionando corretamente acessando:
```
https://kurpshcdafxbyqnzxvxu.supabase.co/functions/v1/test-mercadopago
```

## Solução de Problemas

Se encontrar problemas durante o deploy:

1. **Erro de autenticação**: Execute `npx supabase login` novamente
2. **Erro de permissão**: Verifique se você tem os privilégios necessários no projeto Supabase
3. **Erro na função**: Verifique os logs da função no dashboard do Supabase
