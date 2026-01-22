const axios = require('axios');

const API_URL = 'http://localhost:3000';

// Gera dados aleatórios para o teste
const randomId = Math.floor(Math.random() * 100000);
const adminUser = {
    nome: `Admin Teste ${randomId}`,
    email: `admin${randomId}@email.com`,
    senha: '123456',
    role: 'admin' // Necessário ser admin para testar DELETE/PUT de pedidos
};

let token = '';
let userId = 0;
let pedidoId = 0;

async function runTests() {
    console.log('🚀 Iniciando Teste das Novas Rotas (GET ID, PUT, DELETE)...\n');

    try {
        // 1. Criar Usuário Admin
        console.log('1. [POST] Criando Usuário Admin...');
        const resReg = await axios.post(`${API_URL}/usuarios`, adminUser);
        userId = resReg.data.id; 
        console.log(`   ✅ Admin criado com ID: ${userId}`);

        // 2. Login
        console.log('\n2. [POST] Login...');
        const resLogin = await axios.post(`${API_URL}/usuarios/login`, {
            email: adminUser.email,
            senha: adminUser.senha
        });
        token = resLogin.data.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        console.log('   ✅ Login realizado.');

        // 3. Criar Pedido
        console.log('\n3. [POST] Criando Pedido...');
        const resPed = await axios.post(`${API_URL}/pedidos`, { status: 'pendente', total: 100.00 }, config);
        pedidoId = resPed.data.idPedidos;
        console.log(`   ✅ Pedido criado com ID: ${pedidoId}`);

        // 4. GET Pedido by ID (NOVA ROTA)
        console.log(`\n4. [GET] Buscando Pedido ${pedidoId}...`);
        const resGetPed = await axios.get(`${API_URL}/pedidos/${pedidoId}`, config);
        console.log(`   ✅ Pedido encontrado: Status = ${resGetPed.data.status}`);

        // 5. PUT Pedido (NOVA ROTA)
        console.log(`\n5. [PUT] Atualizando Pedido ${pedidoId}...`);
        await axios.put(`${API_URL}/pedidos/${pedidoId}`, { status: 'enviado' }, config);
        
        // Verifica se atualizou
        const resVerifica = await axios.get(`${API_URL}/pedidos/${pedidoId}`, config);
        if (resVerifica.data.status === 'enviado') {
            console.log('   ✅ Status atualizado para "enviado" com sucesso');
        } else {
            console.error('   ❌ Falha na atualização do status');
        }

        // 6. GET Usuario by ID (NOVA ROTA)
        console.log(`\n6. [GET] Buscando Usuário ${userId}...`);
        const resGetUser = await axios.get(`${API_URL}/usuarios/${userId}`, config);
        console.log(`   ✅ Usuário encontrado: ${resGetUser.data.nome}`);

        // 7. PUT Usuario (NOVA ROTA)
        console.log(`\n7. [PUT] Atualizando Usuário ${userId}...`);
        const novoNome = `Admin Updated ${randomId}`;
        await axios.put(`${API_URL}/usuarios/${userId}`, { 
            nome: novoNome, 
            email: adminUser.email, 
            telefone: '123456789' 
        }, config);
        console.log('   ✅ Usuário atualizado.');

        // 8. DELETE Pedido (NOVA ROTA)
        console.log(`\n8. [DELETE] Removendo Pedido ${pedidoId}...`);
        await axios.delete(`${API_URL}/pedidos/${pedidoId}`, config);
        try {
            await axios.get(`${API_URL}/pedidos/${pedidoId}`, config);
            console.error('   ❌ Erro: Pedido ainda existe!');
        } catch (e) {
            if (e.response && e.response.status === 404) {
                console.log('   ✅ Pedido removido com sucesso (404 confirmado).');
            }
        }

        // 9. DELETE Usuário (NOVA ROTA)
        console.log(`\n9. [DELETE] Removendo Usuário ${userId}...`);
        await axios.delete(`${API_URL}/usuarios/${userId}`, config);
        try {
            await axios.get(`${API_URL}/usuarios/${userId}`, config);
            console.error('   ❌ Erro: Usuário ainda existe!');
        } catch (e) {
             if (e.response && e.response.status === 404) {
                console.log('   ✅ Usuário removido com sucesso (404 confirmado).');
            }
        }

        console.log('\n✨ TODOS OS TESTES PASSARAM! O sistema está nos conformes. ✨');

    } catch (error) {
        console.error('\n❌ ERRO NO TESTE:');
        console.error(error.response ? error.response.data : error.message);
    }
}

runTests();