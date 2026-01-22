const axios = require('axios');

const API_URL = 'http://localhost:3000';

async function testAPI() {
    try {
        console.log('Testando endpoint raiz...');
        const res = await axios.get(`${API_URL}`, { timeout: 5000 });
        console.log('✅ Resposta:', res.data);
    } catch (error) {
        console.error('❌ Erro:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testAPI();
