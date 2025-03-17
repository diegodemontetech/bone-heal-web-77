#!/bin/bash

# Script de deploy para o Bone Heal Web
# Este script copia os arquivos compilados para o servidor de produção

echo "🚀 Iniciando processo de deploy para boneheal.com.br"

# Verificar se já existem alterações não commitadas
echo "📃 Verificando status do git..."
git status --porcelain

if [ $? -eq 0 ] && [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Existem alterações não commitadas. Deseja continuar? (s/n)"
    read CONTINUAR
    if [ "$CONTINUAR" != "s" ]; then
        echo "❌ Deploy cancelado. Faça commit das suas alterações primeiro."
        exit 1
    fi
fi

# Compilar a aplicação
echo "💶 Construindo aplicação..."
npm run build

# Verificar se a compilação foi bem-sucedida
if [ $? -ne 0 ]; then
    echo "❌ Falha na compilação. Verifique os erros acima."
    exit 1
fi

echo "✅ Compilação concluída com sucesso"

# Configurar destino para o deploy
SERVER="admin@boneheal.com.br"
DEST_PATH="/var/www/boneheal.com.br/html"

echo "📤 Preparando para enviar arquivos para o servidor de produção..."
echo "   Servidor: $SERVER"
echo "   Destino: $DEST_PATH"

# Verificar se o usuário deseja prosseguir
echo "⚠️  Deseja continuar com o deploy para o servidor de produção? (s/n)"
read DEPLOY_CONFIRM

if [ "$DEPLOY_CONFIRM" != "s" ]; then
    echo "❌ Deploy cancelado pelo usuário."
    exit 1
fi

# Gerar arquivo compactado para upload manual se necessário
echo "📦 Criando arquivo ZIP da build para upload manual..."
cd dist
zip -r ../bone-heal-web-dist.zip .
cd ..

echo "🔐 Tentando conectar via SSH..."
ssh -o ConnectTimeout=5 $SERVER "echo Conexão SSH estabelecida."

if [ $? -eq 0 ]; then
    # Fazer backup dos arquivos existentes
    echo "📑 Fazendo backup dos arquivos existentes no servidor..."
    ssh $SERVER "mkdir -p ${DEST_PATH}_backup_$(date +%Y%m%d%H%M%S) && cp -r $DEST_PATH/* ${DEST_PATH}_backup_$(date +%Y%m%d%H%M%S)/"

    # Enviar os novos arquivos
    echo "🔄 Enviando novos arquivos..."
    rsync -avz --delete dist/ $SERVER:$DEST_PATH/

    if [ $? -ne 0 ]; then
        echo "❌ Falha no envio dos arquivos via rsync. Tente fazer upload manual do arquivo bone-heal-web-dist.zip"
    else
        echo "✅ Deploy via SSH concluído com sucesso!"
    fi
else
    echo "⚠️  Não foi possível conectar via SSH. Será necessário fazer upload manual."
    echo "   O arquivo bone-heal-web-dist.zip foi criado. Faça upload desse arquivo para o servidor e extraia no diretório $DEST_PATH."
fi

# Deploy das Edge Functions do Supabase
echo "🚀 Gostaria de fazer deploy das Edge Functions também? (s/n)"
read DEPLOY_FUNCTIONS

if [ "$DEPLOY_FUNCTIONS" = "s" ]; then
    echo "🛠 Executando script de deploy das Edge Functions..."
    supabase/functions/deploy-functions.sh
fi

echo "✅ Processo de deploy finalizado!"
echo "🌐 Quando os arquivos forem enviados para o servidor, o site boneheal.com.br será atualizado."
echo "   Lembre-se de limpar o cache do navegador para ver as alterações mais recentes."
