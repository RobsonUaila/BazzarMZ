#!/usr/bin/env node

require('dotenv').config();
const db = require('./db');

console.log('\n═══════════════════════════════════════════════════════');
console.log('   🗑️  REMOVER BASE DE DADOS ANTIGA');
console.log('═══════════════════════════════════════════════════════\n');

const DB_TO_DROP = 'ac_eletricidade';
const DB_CURRENT = process.env.DB_NAME || 'ecommerce';

console.log(`📊 Informações:`);
console.log(`   Base de dados ATUAL (em uso): ${DB_CURRENT}`);
console.log(`   Base de dados a REMOVER: ${DB_TO_DROP}\n`);

// Verificar se é a mesma base
if (DB_TO_DROP === DB_CURRENT) {
    console.error(`❌ ERRO: Você está tentando remover a base de dados que está sendo usada!`);
    console.error(`   Operação cancelada por segurança.\n`);
    process.exit(1);
}

// Confirmar antes de deletar
console.log(`⚠️  ATENÇÃO: Esta operação é IRREVERSÍVEL!`);
console.log(`   Você está prestes a DELETAR a base de dados: "${DB_TO_DROP}"\n`);

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Digite "SIM" para confirmar a exclusão: ', (answer) => {
    rl.close();
    
    if (answer.toUpperCase() !== 'SIM') {
        console.log('\n❌ Operação cancelada.\n');
        process.exit(0);
    }
    
    // Executar o DROP DATABASE
    const sql = `DROP DATABASE IF EXISTS \`${DB_TO_DROP}\``;
    
    console.log(`\n🔄 Removendo base de dados...`);
    db.query(sql, (err, results) => {
        if (err) {
            console.error(`\n❌ ERRO ao remover base de dados:`);
            console.error(`   ${err.message}\n`);
            process.exit(1);
        }
        
        console.log(`\n✅ Base de dados "${DB_TO_DROP}" removida com sucesso!`);
        console.log(`\n📊 Base de dados ativa agora: "${DB_CURRENT}"\n`);
        console.log(`═══════════════════════════════════════════════════════\n`);
        process.exit(0);
    });
});
