#!/bin/bash

# Script para fazer deploy das Edge Functions do Supabase
# Autor: Bone Heal Web Team

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # Sem cor

# Configuração
PROJECT_REF="kurpshcdafxbyqnzxvxu" # ID do projeto Supabase
FUNCTIONS_TO_DEPLOY=("test-mercadopago" "mercadopago-webhook" "check-payment" "create-payment")

# Verificar se o ID do projeto foi informado
if [ -z "$PROJECT_REF" ]; then
    echo -e "${YELLOW}⚠️  Nenhum ID de projeto definido no script. Informe o ID do projeto:${NC}"
    read -p "Project Ref: " PROJECT_REF
    
    if [ -z "$PROJECT_REF" ]; then
        echo -e "${RED}❌ ID do projeto é obrigatório. Abortando.${NC}"
        exit 1
    fi
fi

# Verificar se o Supabase CLI está instalado
if ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ O npx não foi encontrado. Instale o Node.js e tente novamente.${NC}"
    exit 1
fi

# Fazer login no Supabase, se necessário
echo -e "${YELLOW}🔑 Verificando autenticação no Supabase...${NC}"
npx supabase projects list &> /dev/null
RESULT=$?

if [ $RESULT -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Login necessário no Supabase CLI${NC}"
    npx supabase login
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Falha ao fazer login no Supabase. Verifique suas credenciais e tente novamente.${NC}"
        exit 1
    fi
fi

# Perguntar se deseja fazer deploy de todas as funções ou apenas algumas específicas
echo -e "${YELLOW}📦 Escolha uma opção de deploy:${NC}"
echo "1) Todas as functions"
echo "2) Apenas uma function específica"
read -p "Opção (1/2): " DEPLOY_OPTION

if [ "$DEPLOY_OPTION" = "1" ]; then
    # Deploy de todas as functions
    echo -e "${GREEN}🚀 Iniciando deploy de todas as Edge Functions...${NC}"
    
    npx supabase functions deploy --project-ref $PROJECT_REF
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Falha ao fazer deploy de todas as functions. Verifique os logs acima.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Deploy de todas as Edge Functions concluído com sucesso!${NC}"
    
elif [ "$DEPLOY_OPTION" = "2" ]; then
    # Listar as functions disponíveis
    echo -e "${YELLOW}📋 Functions disponíveis:${NC}"
    for i in "${!FUNCTIONS_TO_DEPLOY[@]}"; do
        echo "$((i+1))) ${FUNCTIONS_TO_DEPLOY[$i]}"
    done
    
    # Solicitar qual função deseja implantar
    read -p "Escolha o número da function para deploy: " FUNCTION_INDEX
    
    # Verificar input
    if ! [[ "$FUNCTION_INDEX" =~ ^[0-9]+$ ]]; then
        echo -e "${RED}❌ Número inválido. Abortando.${NC}"
        exit 1
    fi
    
    # Ajustar índice (array começa em 0, mas usuario começa a contar em 1)
    FUNCTION_INDEX=$((FUNCTION_INDEX-1))
    
    if [ $FUNCTION_INDEX -lt 0 ] || [ $FUNCTION_INDEX -ge ${#FUNCTIONS_TO_DEPLOY[@]} ]; then
        echo -e "${RED}❌ Índice fora do intervalo. Abortando.${NC}"
        exit 1
    fi
    
    FUNCTION_NAME=${FUNCTIONS_TO_DEPLOY[$FUNCTION_INDEX]}
    
    # Deploy da função selecionada
    echo -e "${GREEN}🚀 Iniciando deploy da function: ${FUNCTION_NAME}...${NC}"
    
    npx supabase functions deploy $FUNCTION_NAME --project-ref $PROJECT_REF
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Falha ao fazer deploy da function ${FUNCTION_NAME}. Verifique os logs acima.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Deploy da function ${FUNCTION_NAME} concluído com sucesso!${NC}"
    
else
    echo -e "${RED}❌ Opção inválida. Abortando.${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Processo de deploy concluído!${NC}"
echo -e "${YELLOW}📝 Verifique o dashboard do Supabase para confirmar que tudo está funcionando corretamente.${NC}"
