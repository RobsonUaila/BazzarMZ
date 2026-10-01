require('dotenv').config({ path: './.env', override: true });
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    console.log('Testando conexão com:');
    console.log('Host:', process.env.DB_HOST);
    console.log('User:', process.env.DB_USERNAME);
    console.log('DB:', process.env.DB_DATABASE);
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT,
      ssl: {
          minVersion: 'TLSv1.2',
          rejectUnauthorized: false
      }
    });
    
    console.log('✅ Conexão bem sucedida!');
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM produtos');
    console.log(`📦 Produtos encontrados na BD: ${rows[0].count}`);
    
    await connection.end();
  } catch (err) {
    console.error('❌ Erro na conexão:', err.message);
  }
}

testConnection();
