# Verificação de Deploy no Ambiente de Produção

## Verificações do Frontend

1. **Verificar carregamento da aplicação:**
   - Acesse [https://boneheal.com.br](https://boneheal.com.br)
   - Confirme que a página inicial carrega sem erros
   - Verifique se as imagens e estilos estão sendo carregados corretamente

2. **Verificar login e autenticação:**
   - Tente fazer login com credenciais válidas
   - Confirme que você é redirecionado para a área restrita após o login
   - Verifique se o estado de autenticação persiste após recarregar a página

3. **Testar fluxo de checkout:**
   - Adicione produtos ao carrinho
   - Prossiga para o checkout
   - Verifique se o cálculo de frete está funcionando corretamente
   - Confirme que o redirecionamento para o pagamento ocorre conforme esperado

## Verificações das Edge Functions

1. **Testar a função `test-mercadopago`:**
   - Acesse [https://kurpshcdafxbyqnzxvxu.supabase.co/functions/v1/test-mercadopago](https://kurpshcdafxbyqnzxvxu.supabase.co/functions/v1/test-mercadopago)
   - Verifique se a resposta inclui os status esperados do Mercado Pago
   - Confirme que não há erros na resposta

2. **Verificar logs das funções:**
   ```bash
   npx supabase functions logs test-mercadopago --project-ref kurpshcdafxbyqnzxvxu
   ```
   - Analise os logs em busca de erros ou comportamentos inesperados
   - Verifique se as funções estão recebendo e processando as requisições corretamente

## Verificações do Banco de Dados

1. **Verificar tabelas e dados:**
   - Acesse o [Dashboard do Supabase](https://supabase.com/dashboard/project/kurpshcdafxbyqnzxvxu/editor)
   - Verifique se todas as tabelas necessárias existem e contêm os dados esperados
   - Confirme que não houve perda de dados durante o deploy

2. **Testar consultas críticas:**
   - Execute as principais consultas utilizadas pela aplicação
   - Confirme que as consultas retornam os resultados esperados
   - Verifique o desempenho das consultas para identificar possíveis gargalos

## Lista de Verificação Pós-Deploy

- [ ] Frontend carrega sem erros
- [ ] Imagens dos produtos são exibidas corretamente
- [ ] Autenticação funciona como esperado
- [ ] CEP do usuário é carregado automaticamente no checkout
- [ ] Cálculo de frete está funcionando corretamente
- [ ] Integração com o Mercado Pago está operacional
- [ ] Edge Functions respondem corretamente às requisições
- [ ] Não há erros nos logs das Edge Functions
- [ ] Banco de dados está íntegro e atualizado

## Procedimento de Rollback (em caso de problemas)

1. **Restaurar versão anterior do frontend:**
   - Acesse o servidor via SSH:
     ```bash
     ssh admin@boneheal.com.br
     ```
   - Restaure o backup anterior:
     ```bash
     cp -r /var/www/boneheal.com.br/html_backup_[DATA]/. /var/www/boneheal.com.br/html/
     ```

2. **Reverter Edge Functions:**
   - Implante a versão anterior das funções:
     ```bash
     cd /caminho/para/versao/anterior
     npx supabase functions deploy --project-ref kurpshcdafxbyqnzxvxu
     ```

3. **Informe a equipe sobre o rollback e os motivos da reversão**
