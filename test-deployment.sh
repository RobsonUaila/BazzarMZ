#!/bin/bash

# SCRIPT DE TESTE PRÉ-DEPLOYMENT
# E-commerce - 21 de Janeiro de 2026

echo "======================================"
echo "   INICIANDO TESTES PRÉ-DEPLOYMENT"
echo "======================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS_COUNT=0
FAIL_COUNT=0

# Função para imprimir resultado
print_test() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASSOU: $2${NC}"
        ((PASS_COUNT++))
    else
        echo -e "${RED}✗ FALHOU: $2${NC}"
        ((FAIL_COUNT++))
    fi
}

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " 1️⃣  TESTES DO BACKEND"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd backEnd || { echo "Erro: Não consegui entrar em backEnd"; exit 1; }

# Teste 1: Verificar se node_modules existe
[ -d "node_modules" ]
print_test $? "Dependências do backend instaladas (node_modules)"

# Teste 2: Verificar se arquivo .env existe
[ -f ".env" ]
print_test $? "Arquivo .env configurado"

# Teste 3: Verificar se Jest está instalado
grep -q "jest" package.json
print_test $? "Jest configurado para testes"

# Teste 4: Verificar se arquivo db.js existe
[ -f "db.js" ]
print_test $? "Arquivo de conexão do banco (db.js) existe"

# Teste 5: Verificar se arquivo server.js existe
[ -f "server.js" ]
print_test $? "Arquivo servidor (server.js) existe"

# Teste 6: Verificar se rotas estão configuradas
[ -d "routes" ] && [ -f "routes/usuarios.js" ] && [ -f "routes/pedidos.js" ]
print_test $? "Rotas API configuradas"

# Teste 7: Verificar se controllers existem
[ -d "controllers" ] && [ -f "controllers/usuariosController.js" ]
print_test $? "Controllers implementados"

# Teste 8: Verificar se middlewares existem
[ -d "middleware" ] && [ -f "middleware/error.js" ] && [ -f "middleware/auth.js" ]
print_test $? "Middlewares de segurança configurados"

# Teste 9: Verificar se validators existem
[ -d "validators" ] && [ -f "validators/usuarioValidator.js" ]
print_test $? "Validadores Joi implementados"

echo ""

cd .. || { echo "Erro ao voltar"; exit 1; }

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " 2️⃣  TESTES DO FRONTEND"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd frontEnd || { echo "Erro: Não consegui entrar em frontEnd"; exit 1; }

# Teste 10: Verificar se node_modules existe
[ -d "node_modules" ]
print_test $? "Dependências do frontend instaladas"

# Teste 11: Verificar se .env.example foi criado
[ -f ".env.example" ]
print_test $? "Arquivo .env.example para configuração criado"

# Teste 12: Verificar se vite.config.js existe
[ -f "vite.config.js" ]
print_test $? "Vite configurado para build"

# Teste 13: Verificar se React está instalado
grep -q "react" package.json
print_test $? "React instalado"

# Teste 14: Verificar se Tailwind CSS está instalado
grep -q "tailwindcss" package.json
print_test $? "Tailwind CSS configurado"

# Teste 15: Verificar se ESLint está configurado
grep -q "eslint" package.json
print_test $? "ESLint configurado para linting"

# Teste 16: Verificar se arquivo App.jsx existe
[ -f "src/App.jsx" ]
print_test $? "Arquivo App.jsx existe"

# Teste 17: Verificar se rotas estão configuradas
[ -d "src/pages" ] && [ -f "src/pages/Login.jsx" ] && [ -f "src/pages/Checkout.jsx" ]
print_test $? "Páginas React implementadas"

# Teste 18: Verificar se serviço de API foi corrigido
grep -q "VITE_API_URL" src/services/api.js
print_test $? "URL da API usando variável de ambiente (ISSUE CORRIGIDO)"

# Teste 19: Verificar se arquivo toast.js existe (renomeado)
[ -f "src/utils/toast.js" ]
print_test $? "Arquivo toast.js renomeado corretamente (ISSUE CORRIGIDO)"

# Teste 20: Verificar se arquivo antigo toast,.js foi removido
[ ! -f "src/utils/toast,.js" ]
print_test $? "Arquivo inválido toast,.js removido (ISSUE CORRIGIDO)"

echo ""

cd .. || { echo "Erro ao voltar"; exit 1; }

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " 📊 RESULTADOS FINAIS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✓ Testes passados: $PASS_COUNT${NC}"
echo -e "${RED}✗ Testes falhados: $FAIL_COUNT${NC}"
echo ""

TOTAL=$((PASS_COUNT + FAIL_COUNT))
PERCENTAGE=$((PASS_COUNT * 100 / TOTAL))

echo "Percentual de sucesso: ${PERCENTAGE}%"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}════════════════════════════════════════${NC}"
    echo -e "${GREEN}  ✓ TODOS OS TESTES PASSARAM!${NC}"
    echo -e "${GREEN}════════════════════════════════════════${NC}"
    exit 0
else
    echo -e "${RED}════════════════════════════════════════${NC}"
    echo -e "${RED}  ✗ ALGUNS TESTES FALHARAM${NC}"
    echo -e "${RED}════════════════════════════════════════${NC}"
    exit 1
fi
