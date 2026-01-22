#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Limpar todo cache do require
Object.keys(require.cache).forEach(key => {
    delete require.cache[key];
});

console.log('\n═══════════════════════════════════════════════════════');
console.log('   🔍 VERIFICAÇÃO DE CONFIGURAÇÃO DO BANCO DE DADOS');
console.log('═══════════════════════════════════════════════════════\n');

// Leitura direta do arquivo para debug
const envPath = path.resolve('.env');
console.log(`📄 Caminho do arquivo .env: ${envPath}`);

if (!fs.existsSync(envPath)) {
    console.error(`❌ Arquivo .env não encontrado em: ${envPath}`);
    process.exit(1);
}

console.log(`✅ Arquivo encontrado\n`);

// Ler arquivo diretamente
const envContent = fs.readFileSync(envPath, 'utf8');
console.log(`📋 Conteúdo do arquivo .env:`);
const dbLines = envContent.split('\n').filter(l => l.includes('DB_') && !l.startsWith('#'));
dbLines.forEach(line => {
    console.log(`   ${line}`);
});

// Carregar variáveis
require('dotenv').config({ override: true, path: envPath });

console.log(`\n📊 Variáveis Carregadas no Process:`);
console.log(`   DB_HOST: ${process.env.DB_HOST || '(não definido)'}`);
console.log(`   DB_USER: ${process.env.DB_USER || '(não definido)'}`);
console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '••••••••' : '(não definido)'}`);
console.log(`   DB_NAME: ${process.env.DB_NAME || '(não definido)'}`);

const dbName = process.env.DB_NAME || 'ecommerce';
console.log(`\n🎯 Banco de dados: "${dbName}"`);

// Verificar mysqldump
console.log(`\n🛠️  MySQL:`);
let mysqldumpPath = process.env.MYSQLDUMP_PATH || 'mysqldump';

if (process.platform === 'win32') {
    const commonPaths = [
        'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe',
        'C:\\Program Files (x86)\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe',
        'C:\\Program Files\\MySQL\\MySQL Server 5.7\\bin\\mysqldump.exe',
        'C:\\xampp\\mysql\\bin\\mysqldump.exe',
    ];
    
    for (const tryPath of commonPaths) {
        if (fs.existsSync(tryPath)) {
            mysqldumpPath = tryPath;
            break;
        }
    }
}

console.log(`   MYSQLDUMP: ${mysqldumpPath}`);
console.log(`   Status: ${fs.existsSync(mysqldumpPath) ? '✅ Encontrado' : '❌ Não encontrado'}`);

console.log('\n═══════════════════════════════════════════════════════\n');
