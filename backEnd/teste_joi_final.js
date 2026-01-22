const axios = require('axios');

const API_URL = 'http://localhost:3000';

// Gera dados aleatórios para não dar erro de "Email duplicado"
const randomId = Math.floor(Math.random() * 100000);
const usuarioTeste = {
    nome: `Usuario Teste ${randomId}`,
    email: `teste${randomId}@email.com`,
    senha: '123456',
    role: 'user'
};

let token = '';
let pedidoId = 0;

async function runTests() {
    console.log('🚀 Iniciando Teste com Validação Joi...\n');

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

        // 3. Teste de Criar Pedido COM VALIDAÇÃO JOI (CORRIGIDO)
        console.log('\n3. [POST] Criando Pedido (com validação)...');
        const pedidoData = { 
            status: 'pendente', 
            total: 250.50 
        };
        const resPedido = await axios.post(`${API_URL}/pedidos`, pedidoData, authConfig);
        pedidoId = resPedido.data.idPedidos;
        console.log(`   ✅ Pedido criado com ID: ${pedidoId}`);

        // 4. Teste de Criar Pedido com dados INVÁLIDOS (deve falhar)
        console.log('\n4. [POST] Teste de Validação - Pedido com dados inválidos...');
        try {
            await axios.post(`${API_URL}/pedidos`, { status: 'invalido', total: -100 }, authConfig);
            console.log('   ❌ ERRO: Deveria ter rejeitado dados inválidos!');
        } catch (validationError) {
            if (validationError.response.status === 400) {
                console.log('   ✅ Validação funcionou! Rejeitou dados inválidos:');
                console.log('      Detalhes:', validationError.response.data.detalhes);
            }
        }

        // 5. Teste de Adicionar Item ao Pedido COM VALIDAÇÃO JOI (CORRIGIDO)
        console.log('\n5. [POST] Adicionando Item ao Pedido (com validação)...');
        const itemData = {
            idPedidos: pedidoId,
            idProduto: 101,
            quantidade: 2,
            preco_unitario: 125.25
        };
        const resItem = await axios.post(`${API_URL}/itens-pedidos`, itemData, authConfig);
        console.log(`   ✅ Item adicionado com ID: ${resItem.data.idItem}`);

        // 6. Teste de Item com dados INVÁLIDOS (deve falhar)
        console.log('\n6. [POST] Teste de Validação - Item com dados inválidos...');
        try {
            await axios.post(`${API_URL}/itens-pedidos`, 
                { idPedidos: 'abc', idProduto: -5, quantidade: 0, preco_unitario: -10 }, 
                authConfig
            );
            console.log('   ❌ ERRO: Deveria ter rejeitado dados inválidos!');
        } catch (validationError) {
            if (validationError.response.status === 400) {
                console.log('   ✅ Validação funcionou! Rejeitou dados inválidos:');
                console.log('      Detalhes:', validationError.response.data.detalhes);
            }
        }

        // 7. Teste de Listar Pedidos
        console.log('\n7. [GET] Verificando Pedidos do Usuário...');
        const resMeusPedidos = await axios.get(`${API_URL}/pedidos`, authConfig);
        const pedidoEncontrado = resMeusPedidos.data.find(p => p.idPedidos === pedidoId);
        
        if (pedidoEncontrado) {
            console.log('   ✅ Pedido verificado na lista com sucesso!');
            console.log(`      Status: ${pedidoEncontrado.status}, Total: ${pedidoEncontrado.total}`);
        }

        console.log('\n✨ TESTE CONCLUÍDO COM SUCESSO! ✨');
        console.log('✅ Validação Joi funcionando em pedidos e itens');

    } catch (error) {
        console.error('\n❌ FALHA NO TESTE:');
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Mensagem:`, JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error('   Nenhuma resposta recebida');
        } else {
            console.error(`   Erro: ${error.message}`);
        }
    }
}

runTests();
