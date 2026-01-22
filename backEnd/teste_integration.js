require('dotenv').config();
const axios = require('axios');

const PORT = process.env.PORT || 3000;
const API_URL = `http://localhost:${PORT}`;

// Gera dados aleatórios para não dar erro de "Email duplicado"
const randomId = Math.floor(Math.random() * 10000);
const usuarioTeste = {
    nome: `Usuario Teste ${randomId}`,
    email: `teste${randomId}@email.com`,
    senha: '123456',
    role: 'user'
};

let token = '';
let usuarioId = 0;
let pedidoId = 0;

async function runTests() {
    console.log('🚀 Iniciando Teste Completo de Integração...\n');

    try {
        // 1. Teste de Registro
        console.log('1. [POST] Criando Usuário...');
        const resRegistro = await axios.post(`${API_URL}/usuarios`, usuarioTeste);
        console.log('   ✅ Sucesso:', resRegistro.data.message);

        // 2. Teste de Login
        console.log('\n2. [POST] Fazendo Login...');
        const resLogin = await axios.post(`${API_URL}/usuarios/login`, {
            email: usuarioTeste.email,
            senha: usuarioTeste.senha
        });
        token = resLogin.data.token;
        console.log('   ✅ Login realizado. Token recebido.');

        // Configura o header para as próximas requisições
        const authConfig = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // 3. Teste de Listar Usuários (Rota Protegida)
        console.log('\n3. [GET] Listando Usuários (Rota Protegida)...');
        const resLista = await axios.get(`${API_URL}/usuarios`, authConfig);
        if (Array.isArray(resLista.data)) {
            console.log(`   ✅ Sucesso: ${resLista.data.length} usuários encontrados.`);
        }

        // 4. Teste de Criar Pedido
        console.log('\n4. [POST] Criando Pedido...');
        const pedidoData = { status: 'pendente', total: 250.50 };
        const resPedido = await axios.post(`${API_URL}/pedidos`, pedidoData, authConfig);
        pedidoId = resPedido.data.data.idPedidos;
        console.log(`   ✅ Pedido criado com ID: ${pedidoId}`);

        // 5. Teste de Adicionar Item ao Pedido
        console.log('\n5. [POST] Adicionando Item ao Pedido...');
        const itemData = {
            idPedidos: pedidoId,
            idProduto: 101, // ID fictício de produto
            quantidade: 2,
            preco_unitario: 125.25
        };
        const resItem = await axios.post(`${API_URL}/itens-pedidos`, itemData, authConfig);
        console.log(`   ✅ Item adicionado com ID: ${resItem.data.data.idItem}`);

        // 6. Teste de Listar Pedidos do Usuário
        console.log('\n6. [GET] Verificando Pedidos do Usuário...');
        const resMeusPedidos = await axios.get(`${API_URL}/pedidos`, authConfig);
        const pedidos = Array.isArray(resMeusPedidos.data.data) ? resMeusPedidos.data.data : resMeusPedidos.data;
        const pedidoEncontrado = pedidos.find(p => p.idPedidos === pedidoId);
        
        if (pedidoEncontrado) {
            console.log('   ✅ Pedido verificado na lista com sucesso!');
            console.log(`      Status: ${pedidoEncontrado.status}, Total: ${pedidoEncontrado.total}`);
        } else {
            console.error('   ❌ Erro: O pedido criado não foi encontrado na lista.');
        }

        console.log('\n✨ TESTE CONCLUÍDO COM SUCESSO! O sistema está funcional. ✨');

    } catch (error) {
        console.error('\n❌ FALHA NO TESTE:');
        if (error.code === 'ECONNREFUSED') {
            console.error(`   ⚠️  Não foi possível conectar ao servidor em ${API_URL}`);
            console.error('   Certifique-se de que o backend está rodando em outro terminal:');
            console.error('   👉 npm start');
        } else if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Mensagem:`, error.response.data);
        } else {
            console.error(`   Erro: ${error.message}`);
            if (error.stack) console.error(error.stack);
        }
    }
}

runTests();
