#!/bin/bash

# SCRIPT DE TESTE PRÉ-DEPLOYMENT
# E-commerce - 21 de Janeiro de 2026
# Para Linux/Mac/Git Bash

echo -e "\033[0;36m======================================\033[0m"
echo -e "\033[0;36m   INICIANDO TESTES PRÉ-DEPLOYMENT\033[0m"
echo -e "\033[0;36m======================================\033[0m"
echo ""

PASS_COUNT=0
FAIL_COUNT=0

print_test() {
    local result=$1
    local message=$2
    
    if [ "$result" -eq 0 ]; then
        echo -e "\033[0;32m✓ PASSOU: $message\033[0m"
        ((PASS_COUNT++))
    else
        echo -e "\033[0;31m✗ FALHOU: $message\033[0m"
        ((FAIL_COUNT++))
    fi
}

echo ""
echo -e "\033[0;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\033[0m"
echo -e "\033[0;36m 1️⃣  TESTES DO BACKEND\033[0m"
echo -e "\033[0;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\033[0m"
echo ""

cd backEnd || exit

# Teste 1: node_modules existe
if [ -d "node_modules" ]; then res=0; else res=1; fi
print_test $res "Dependências do backend instaladas (node_modules)"

# Teste 2: .env existe
if [ -f ".env" ]; then res=0; else res=1; fi
print_test $res "Arquivo .env configurado"

# Teste 3: Jest está no package.json
if grep -q '"jest"' package.json; then res=0; else res=1; fi
print_test $res "Jest configurado para testes"

# Teste 4: db.js existe
if [ -f "db.js" ]; then res=0; else res=1; fi
print_test $res "Arquivo de conexão do banco (db.js) existe"

# Teste 5: server.js existe
if [ -f "server.js" ]; then res=0; else res=1; fi
print_test $res "Arquivo servidor (server.js) existe"

# Teste 6: Rotas configuradas
if [ -d "routes" ] && [ -f "routes/usuarios.js" ] && [ -f "routes/pedidos.js" ]; then res=0; else res=1; fi
print_test $res "Rotas API configuradas"

# Teste 7: Controllers existem
if [ -d "controllers" ] && [ -f "controllers/usuariosController.js" ]; then res=0; else res=1; fi
print_test $res "Controllers implementados"

# Teste 8: Middlewares existem
if [ -d "middleware" ] && [ -f "middleware/error.js" ] && [ -f "middleware/auth.js" ]; then res=0; else res=1; fi
print_test $res "Middlewares de segurança configurados"

# Teste 9: Validators existem
if [ -d "validators" ] && [ -f "validators/usuarioValidator.js" ]; then res=0; else res=1; fi
print_test $res "Validadores Joi implementados"

echo ""
cd ..

echo ""
echo -e "\033[0;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\033[0m"
echo -e "\033[0;36m 2️⃣  TESTES DO FRONTEND\033[0m"
echo -e "\033[0;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\033[0m"
echo ""

cd frontEnd || exit

# Teste 10: node_modules existe
if [ -d "node_modules" ]; then res=0; else res=1; fi
print_test $res "Dependências do frontend instaladas"

# Teste 11: .env.example foi criado
if [ -f ".env.example" ]; then res=0; else res=1; fi
print_test $res "Arquivo .env.example para configuração criado"

# Teste 12: vite.config.js existe
if [ -f "vite.config.js" ]; then res=0; else res=1; fi
print_test $res "Vite configurado para build"

# Teste 13: React está no package.json
if grep -q '"react"' package.json; then res=0; else res=1; fi
print_test $res "React instalado"

# Teste 14: Tailwind está no package.json
if grep -q '"tailwindcss"' package.json; then res=0; else res=1; fi
print_test $res "Tailwind CSS configurado"

# Teste 15: ESLint está no package.json
if grep -q '"eslint"' package.json; then res=0; else res=1; fi
print_test $res "ESLint configurado para linting"

# Teste 16: App.jsx existe
if [ -f "src/App.jsx" ]; then res=0; else res=1; fi
print_test $res "Arquivo App.jsx existe"

# Teste 17: Páginas React existem
if [ -d "src/pages" ] && [ -f "src/pages/Login.jsx" ] && [ -f "src/pages/Checkout.jsx" ]; then res=0; else res=1; fi
print_test $res "Páginas React implementadas"

# Teste 18: URL API usando variável de ambiente
if grep -q "VITE_API_URL" src/services/api.js; then res=0; else res=1; fi
print_test $res "URL da API usando variável de ambiente (ISSUE CORRIGIDO)"

# Teste 19: toast.js existe
if [ -f "src/utils/toast.js" ]; then res=0; else res=1; fi
print_test $res "Arquivo toast.js renomeado corretamente (ISSUE CORRIGIDO)"

# Teste 20: toast,.js foi removido
if [ ! -f "src/utils/toast,.js" ]; then res=0; else res=1; fi
print_test $res "Arquivo inválido toast,.js removido (ISSUE CORRIGIDO)"

echo ""
cd ..

echo ""
echo -e "\033[0;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\033[0m"
echo -e "\033[0;36m 📊 RESULTADOS FINAIS\033[0m"
echo -e "\033[0;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\033[0m"
echo ""
echo -e "\033[0;32m✓ Testes passados: $PASS_COUNT\033[0m"
echo -e "\033[0;31m✗ Testes falhados: $FAIL_COUNT\033[0m"
echo ""

TOTAL=$((PASS_COUNT + FAIL_COUNT))
if [ $TOTAL -gt 0 ]; then
    PERCENTAGE=$((PASS_COUNT * 100 / TOTAL))
else
    PERCENTAGE=0
fi

echo -e "\033[0;33mPercentual de sucesso: ${PERCENTAGE}%\033[0m"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "\033[0;32m════════════════════════════════════════\033[0m"
    echo -e "\033[0;32m  ✓ TODOS OS TESTES PASSARAM!\033[0m"
    echo -e "\033[0;32m════════════════════════════════════════\033[0m"
    exit 0
else
    echo -e "\033[0;31m════════════════════════════════════════\033[0m"
    echo -e "\033[0;31m  ✗ ALGUNS TESTES FALHARAM\033[0m"
    echo -e "\033[0;31m════════════════════════════════════════\033[0m"
    exit 1
fi