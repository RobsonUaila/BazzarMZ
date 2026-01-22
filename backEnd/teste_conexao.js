const http = require('http');

console.log('Tentando conectar a http://127.0.0.1:3000...\n');

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  console.log(`✅ Conectado! Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Resposta:', data);
  });
});

req.on('error', (error) => {
  console.error('❌ Erro na conexão:', error.message);
});

req.on('timeout', () => {
  console.error('❌ Timeout na conexão');
  req.destroy();
});

req.end();
