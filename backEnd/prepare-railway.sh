#!/bin/bash
# Script para preparar Railway deployment automaticamente

echo "🚀 Preparando BazzarMZ Backend para Railway..."
echo ""

# Verificar se está na pasta backend
if [ ! -f "package.json" ]; then
  echo "❌ Erro: Execute este script na pasta backend!"
  exit 1
fi

# Verificar Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js não está instalado!"
  exit 1
fi

echo "✅ Estrutura verificada"
echo ""

# Checklist
echo "📋 CHECKLIST PRÉ-DEPLOYMENT:"
echo ""

# 1. Verificar Procfile
if [ -f "Procfile" ]; then
  echo "✅ Procfile existe"
else
  echo "❌ Procfile não encontrado"
fi

# 2. Verificar railway.json
if [ -f "railway.json" ]; then
  echo "✅ railway.json existe"
else
  echo "❌ railway.json não encontrado"
fi

# 3. Verificar .env.railway
if [ -f ".env.railway" ]; then
  echo "✅ .env.railway existe"
else
  echo "❌ .env.railway não encontrado"
fi

# 4. Verificar migrations
if [ -f "migrations/add-reviews-and-wishlist.sql" ]; then
  echo "✅ Migrations SQL encontradas"
else
  echo "❌ Migrations SQL não encontradas"
fi

# 5. Verificar package.json
if grep -q '"start": "node server.js"' package.json; then
  echo "✅ Start script configurado"
else
  echo "❌ Start script não encontrado"
fi

# 6. Verificar .gitignore
if [ -f ".gitignore" ]; then
  echo "✅ .gitignore existe"
else
  echo "❌ .gitignore não encontrado"
fi

echo ""
echo "🔐 VARIÁVEIS DE AMBIENTE NECESSÁRIAS:"
echo ""
echo "DB_HOST              (fornecido pelo Railway)"
echo "DB_USER              (fornecido pelo Railway)"
echo "DB_PASSWORD          (fornecido pelo Railway)"
echo "DB_NAME              = ecommerce"
echo "DB_PORT              = 3306 (ou 5432)"
echo "JWT_SECRET           (gere uma chave segura)"
echo "ALLOWED_ORIGINS      = seu-dominio.com"
echo "NODE_ENV             = production"
echo "PORT                 = 3000"
echo ""

echo "📥 PRÓXIMOS PASSOS:"
echo ""
echo "1. Acesse https://railway.app"
echo "2. Crie novo projeto"
echo "3. Conecte seu repositório GitHub"
echo "4. Configure variáveis de ambiente"
echo "5. Adicione banco de dados MySQL"
echo "6. Faça deploy"
echo ""

echo "✅ Backend pronto para Railway!"
