#!/bin/bash

echo "🔧 Configurando ambiente Railway..."

# 1. Criar .npmrc para garantir instalação de todas as dependências
echo "production=false" > .npmrc
echo "✅ .npmrc criado (força instalação de devDependencies)"

# 2. Criar configuração do Nixpacks
cat > nixpacks.toml << 'EOF'
[phases.setup]
nixPkgs = ["nodejs_20"]

[phases.install]
cmds = ["npm install"]
EOF
echo "✅ nixpacks.toml criado"

echo "🚀 Setup concluído! Execute: git add . && git commit -m 'chore: railway setup' && git push"