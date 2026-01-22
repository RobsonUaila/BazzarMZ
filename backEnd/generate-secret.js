const crypto = require('crypto');

const secret = crypto.randomBytes(64).toString('hex');
console.log('🔐 Sua nova JWT_SECRET segura:');
console.log('');
console.log(secret);
console.log('');
console.log('👉 Copie e cole no seu arquivo .env ou nas variáveis do Railway');