#!/bin/bash

# Railway Setup Script
# Execute isso ANTES de fazer deploy

echo "🚀 Setup Railway para BazzarMZ Backend"
echo "======================================"
echo ""

# 1. Limpar cache npm
echo "1️⃣ Limpando cache npm..."
npm cache clean --force
rm -rf node_modules package-lock.json
echo "✅ Cache limpo"
echo ""

# 2. Instalar dependências com produção desabilitada
echo "2️⃣ Instalando dependências (devDependencies inclusos)..."
npm install --production=false
echo "✅ Dependências instaladas"
echo ""

# 3. Testar se servidor inicia
echo "3️⃣ Testando se servidor inicia..."
timeout 5 npm start &
WAIT_PID=$!
sleep 2
if kill -0 $WAIT_PID 2>/dev/null; then
  echo "✅ Servidor inicia com sucesso"
  kill $WAIT_PID 2>/dev/null
else
  echo "❌ Servidor falhou ao iniciar"
fi
echo ""

# 4. Verificar arquivos críticos
echo "4️⃣ Verificando arquivos críticos..."
echo "  ✓ Procfile: $(test -f Procfile && echo 'OK' || echo 'MISSING')"
echo "  ✓ railway.json: $(test -f railway.json && echo 'OK' || echo 'MISSING')"
echo "  ✓ nixpacks.toml: $(test -f nixpacks.toml && echo 'OK' || echo 'MISSING')"
echo "  ✓ .npmrc: $(test -f .npmrc && echo 'OK' || echo 'MISSING')"
echo ""

echo "✅ Setup completo! Pronto para deploy no Railway"
echo ""
echo "Próximo passo:"
echo "  git add -A"
echo "  git commit -m 'chore: railway setup complete'"
echo "  git push origin main"
echo "  railway up"
