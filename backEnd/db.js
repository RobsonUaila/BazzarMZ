const mysql = require('mysql');
require('dotenv').config({ override: true }); // Carrega as variáveis e força a substituição das antigas

// Cria a conexão usando as variáveis de ambiente
const db = mysql.createPool({
  connectionLimit: 10, // Mantém até 10 conexões abertas
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Teste simples de conexão ao iniciar (opcional, pois o pool conecta sob demanda)
db.getConnection((err, connection) => {
  if (err) {
    console.error('Erro ao conectar ao pool de banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados MySQL com Pool!');
    connection.release(); // Libera a conexão de volta para o pool
  }
});

module.exports = db;
