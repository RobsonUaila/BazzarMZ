const mysql = require('mysql2');
require('dotenv').config();

// Forçar apenas o banco 'ecommerce'
const dbName = 'ecommerce';

console.log(`🔌 Conectando ao banco: ${dbName}`);
console.log(`   Host: ${process.env.DB_HOST}`);
console.log(`   User: ${process.env.DB_USER}`);

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: dbName,  // Forçado para 'ecommerce'
    port: process.env.DB_PORT || 3306,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;