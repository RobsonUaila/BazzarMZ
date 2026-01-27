const db = require('./db');

console.log('⚠️  ATENÇÃO: Isso apagará TODOS os produtos e avaliações do banco de dados.');
console.log('⏳  Iniciando limpeza...');

async function clearAll() {
    // Wrapper para usar async/await com mysql2
    const query = (sql) => {
        return new Promise((resolve, reject) => {
            db.query(sql, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    };

    try {
        // 1. Limpar Reviews (primeiro devido a chaves estrangeiras)
        try {
            await query('DELETE FROM reviews');
            console.log('✅ Tabela de reviews limpa.');
        } catch (e) {
            // Ignora se a tabela não existir
        }

        // 2. Limpar Produtos
        const result = await query('DELETE FROM produtos');
        console.log(`✅ ${result.affectedRows} produtos removidos com sucesso.`);

        console.log('🎉 Banco de dados limpo!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao limpar banco:', error);
        process.exit(1);
    }
}

clearAll();