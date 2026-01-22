// Script para criar conta admin no banco de dados
const db = require('./db');
const bcrypt = require('bcrypt');

const createAdminUser = async () => {
  const admin = {
    nome: 'Admin BazzarMZ',
    email: 'admin@bazzarmz.com',
    senha: 'BazzarAdmin@2026',
    role: 'admin'
  };

  try {
    console.log('🔧 Criando conta admin...\n');

    // Verificar se admin já existe
    const checkSql = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(checkSql, [admin.email], async (err, results) => {
      if (err) {
        console.error('❌ Erro ao verificar:', err);
        process.exit(1);
      }

      if (results.length > 0) {
        console.log('⚠️  Admin já existe!');
        console.log('\n📊 CREDENCIAIS ADMIN:\n');
        console.log('┌─────────────────────────────────────┐');
        console.log('│        BAZZARMZ ADMIN LOGIN         │');
        console.log('├─────────────────────────────────────┤');
        console.log(`│ Email:    ${admin.email.padEnd(30)} │`);
        console.log(`│ Senha:    ${admin.senha.padEnd(30)} │`);
        console.log(`│ Role:     ${admin.role.padEnd(30)} │`);
        console.log('└─────────────────────────────────────┘\n');
        process.exit(0);
      }

      // Criar nova conta
      const saltRounds = 10;
      const senhaHash = await bcrypt.hash(admin.senha, saltRounds);

      const insertSql = 'INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)';
      db.query(insertSql, [admin.nome, admin.email, senhaHash, admin.role], (err, results) => {
        if (err) {
          console.error('❌ Erro ao criar admin:', err);
          process.exit(1);
        }

        console.log('✅ Conta admin criada com sucesso!\n');
        console.log('📊 CREDENCIAIS ADMIN:\n');
        console.log('┌─────────────────────────────────────┐');
        console.log('│        BAZZARMZ ADMIN LOGIN         │');
        console.log('├─────────────────────────────────────┤');
        console.log(`│ Email:    ${admin.email.padEnd(30)} │`);
        console.log(`│ Senha:    ${admin.senha.padEnd(30)} │`);
        console.log(`│ Role:     ${admin.role.padEnd(30)} │`);
        console.log('├─────────────────────────────────────┤');
        console.log('│ URL Login: /login                   │');
        console.log('│ Dashboard: /AdminDashboard          │');
        console.log('└─────────────────────────────────────┘\n');
        
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
};

createAdminUser();
