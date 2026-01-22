require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuração do banco de dados
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'ecommerce';

console.log(`\n🔍 Verificação de Variáveis de Ambiente:`);
console.log(`   - DB_NAME (do .env): "${process.env.DB_NAME}"`);
console.log(`   - DB_NAME (usado): "${DB_NAME}"`);

// Se a variável estiver vazia, usar fallback
if (!process.env.DB_NAME || process.env.DB_NAME.trim() === '') {
    console.warn(`   ⚠️  DB_NAME está vazio no .env, usando fallback: "ecommerce"`);
}
// Remove aspas extras caso o usuário tenha colocado no .env e garante fallback
const MYSQLDUMP_PATH = (process.env.MYSQLDUMP_PATH || 'mysqldump').replace(/"/g, '');

// Pasta de backup
const backupDir = path.join(__dirname, '../../backups');
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

// Nome do arquivo com data
const date = new Date().toISOString().replace(/[:.]/g, '-');
const fileName = `${DB_NAME}_backup_${date}.sql`;
const filePath = path.join(backupDir, fileName);

console.log(`📦 Iniciando backup de ${DB_NAME}...`);
console.log(`🔍 Diagnóstico de Configuração:`);
console.log(`   - Banco de dados: ${DB_NAME}`);
console.log(`   - Host: ${DB_HOST}`);
console.log(`   - Usuário: ${DB_USER}`);
console.log(`   - Executável Mysqldump: ${MYSQLDUMP_PATH}`);
console.log(`   - Arquivo de Destino: ${filePath}`);

// Verificação prévia do executável (se for um caminho absoluto)
if (path.isAbsolute(MYSQLDUMP_PATH) && !fs.existsSync(MYSQLDUMP_PATH)) {
    console.error(`\n❌ ERRO CRÍTICO: O arquivo do mysqldump não foi encontrado!`);
    console.error(`   Caminho tentado: "${MYSQLDUMP_PATH}"`);
    console.error(`\n   SOLUÇÃO para Windows:`);
    console.error(`   1. Localize o mysqldump no seu computador (geralmente em C:\\Program Files\\MySQL\\MySQL Server X.X\\bin\\mysqldump.exe)`);
    console.error(`   2. Adicione no .env:`);
    console.error(`      MYSQLDUMP_PATH=C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe`);
    console.error(`   3. Execute novamente: node middleware/backup.js`);
    process.exit(1);
}

// Comando mysqldump
const command = `"${MYSQLDUMP_PATH}" --column-statistics=0 -h ${DB_HOST} -u ${DB_USER} ${DB_PASSWORD ? `-p${DB_PASSWORD}` : ''} ${DB_NAME} > "${filePath}"`;

console.log(`\n🚀 Executando comando...`);

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`\n❌ Falha no backup:`);
        console.error(`   Erro: ${error.message}`);
        if (error.message.includes('not recognized') || error.message.includes('ENOENT')) {
            console.error(`\n   💡 SOLUÇÃO: O mysqldump não foi encontrado.`);
            console.error(`   \n   Para Windows:`);
            console.error(`   1. Instale MySQL Server com a opção "MySQL Command Line Client"`);
            console.error(`   2. Ou configure MYSQLDUMP_PATH no .env com o caminho completo`);
            console.error(`   3. Exemplo: MYSQLDUMP_PATH=C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe`);
        }
        return;
    }
    
    // Ignora aviso de senha na linha de comando, que é normal
    if (stderr && !stderr.includes('Using a password') && !stderr.includes('column-statistics')) {
        console.warn(`⚠️  Aviso do MySQL: ${stderr}`);
    }
    console.log(`\n✅ Backup concluído com sucesso!`);
    console.log(`   Arquivo salvo em: ${filePath}`);
    console.log(`   Tamanho: ${fs.statSync(filePath).size} bytes`);
});