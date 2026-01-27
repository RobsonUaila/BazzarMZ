require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('☁️  Testando conexão com Cloudinary...');
console.log(`🔹 Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);

// 1. Testar Ping (Autenticação)
cloudinary.api.ping((error, result) => {
  if (error) {
    console.error('❌ Erro de conexão (Ping):', error);
    process.exit(1);
  } else {
    console.log('✅ Conexão estabelecida (Ping):', result);

    // 2. Testar Upload
    console.log('📤 Tentando upload de imagem de teste...');
    // Usando base64 para evitar erros de DNS/Rede ao buscar imagens externas
    const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';
    cloudinary.uploader.upload(base64Image, { folder: 'test_connection' }, (uploadError, uploadResult) => {
        if (uploadError) console.error('❌ Erro no upload:', uploadError);
        else console.log('✅ Upload realizado com sucesso! URL:', uploadResult.secure_url);
    });
  }
});