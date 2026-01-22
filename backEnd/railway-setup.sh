#!/bin/bash

echo "🧹 Limpando configurações conflitantes do Railway..."

# Remover arquivos que forçam o uso do Nixpacks
rm -f nixpacks.toml .npmrc
rm -f ../nixpacks.toml ../.npmrc

echo "✅ Arquivos de configuração Nixpacks removidos."
echo "🚀 Agora o Railway usará o Dockerfile da raiz. Execute: git add . && git commit -m 'chore: cleanup railway config' && git push"