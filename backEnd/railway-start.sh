#!/bin/bash
# Script de inicialização para Railway
# Executa migrações e inicia o servidor

echo "🚀 Iniciando BazzarMZ Backend no Railway..."

# Aguardar conexão com banco de dados
echo "⏳ Aguardando banco de dados..."
for i in {1..30}; do
  if npm run test:db 2>/dev/null; then
    echo "✅ Banco de dados conectado!"
    break
  fi
  echo "Tentativa $i/30 - Aguardando DB..."
  sleep 2
done

# Executar migrações
echo "🔧 Executando migrações..."
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < ./migrations/add-reviews-and-wishlist.sql || echo "⚠️  Migrações já executadas ou erro"

# Criar admin user se não existir
echo "👤 Verificando admin user..."
node create-admin.js || echo "⚠️  Admin já existe"

# Iniciar servidor
echo "✅ Iniciando servidor na porta 3000..."
npm start
