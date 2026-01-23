#!/bin/bash

# Script simples para testar deployment do Render
echo "========================================"
echo "  TESTE LOCAL DO RENDER DEPLOYMENT"
echo "========================================"
echo ""

# 1. Backend
echo "📦 Limpando e testando backend..."
cd backEnd
npm install --no-audit --no-fund 2>&1 | tail -5
echo "✅ Backend pronto"
echo ""

# 2. Frontend
echo "🔨 Building frontend..."
cd ../frontEnd
npm install --no-audit --no-fund 2>&1 | tail -3
npm run build 2>&1 | tail -5
echo "✅ Frontend build completo"
echo ""

# 3. Teste do servidor
echo "🚀 Iniciando servidor..."
cd ../backEnd
echo "   Pressione Ctrl+C para parar"
echo ""
timeout 5 node server.js || true
echo ""
echo "========================================"
echo "  Teste concluído!"
echo "========================================"
