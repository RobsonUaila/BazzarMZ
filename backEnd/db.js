const mysql = require('mysql2');
require('dotenv').config({ override: true });

console.log(`🔌 Conectando ao banco: ${process.env.DB_DATABASE}`);
console.log(`   Host: ${process.env.DB_HOST}`);
console.log(`   User: ${process.env.DB_USERNAME}`);

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;