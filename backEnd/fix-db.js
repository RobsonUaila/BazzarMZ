const db = require('./db');

async function fixDatabase() {
    console.log('🔄 Verificando e corrigindo schema do banco de dados...');

    try {
        const connection = db.promise();

        // Lista de colunas necessárias
        const columns = [
            { name: 'imagem_capa', def: 'VARCHAR(255)' },
            { name: 'thumbnail', def: 'VARCHAR(255)' },
            { name: 'categoria', def: 'VARCHAR(255)' },
            { name: 'estoque', def: 'INT DEFAULT 0' },
            { name: 'criado_em', def: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
        ];

        for (const col of columns) {
            try {
                await connection.query(`ALTER TABLE produtos ADD COLUMN ${col.name} ${col.def}`);
                console.log(`✅ Coluna '${col.name}' adicionada.`);
            } catch (e) {
                if (e.code === 'ER_DUP_FIELDNAME') {
                    console.log(`ℹ️  Coluna '${col.name}' já existe.`);
                } else {
                    console.error(`❌ Erro ao adicionar '${col.name}':`, e.message);
                }
            }
        }

        console.log('🎉 Banco de dados atualizado com sucesso!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro fatal:', error);
        process.exit(1);
    }
}

fixDatabase();