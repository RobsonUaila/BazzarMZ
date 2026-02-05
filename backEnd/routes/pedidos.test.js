const request = require('supertest');
const app = require('../server'); // Importa a aplicação Express
const db = require('../db'); // Seu pool de conexão

describe('Endpoints de Pedidos - /pedidos', () => {
  let token;
  let userId;

  // Antes de todos os testes, cria um usuário e faz login para obter um token
  beforeAll(async () => {
    // Limpa a tabela de usuários para garantir um estado limpo
    await db.query("DELETE FROM usuarios WHERE email = 'testuser@example.com'");

    // Registra um novo usuário
    await request(app)
      .post('/usuarios/register')
      .send({
        nome: 'Test User',
        email: 'testuser@example.com',
        senha: 'password123',
        role: 'user'
      });
    
    const loginResponse = await request(app)
      .post('/usuarios/login')
      .send({
        email: 'testuser@example.com',
        senha: 'password123'
      });

    token = loginResponse.body.token;
    // Decodifica o token para obter o ID do usuário
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    userId = decoded.id;
  });

  // Antes de cada teste, limpa a tabela de pedidos para evitar poluição
  beforeEach(async () => {
    await db.query('DELETE FROM pedidos');
  });

  // Depois de todos os testes, limpa o banco de dados
  afterAll(async () => {
    // Limpa as tabelas de teste
    await db.query('DELETE FROM pedidos');
    await db.query("DELETE FROM usuarios WHERE email = 'testuser@example.com'");
    await db.end(); // Fecha a conexão com o banco
  });
  
  describe('GET /pedidos', () => {
    it('deve retornar 401 Unauthorized se nenhum token for fornecido', async () => {
      const response = await request(app).get('/pedidos');
      expect(response.statusCode).toBe(401);
    });

    it('deve retornar 200 e uma lista de pedidos para um usuário autenticado', async () => {
      // Cria um pedido de exemplo para o usuário
      await db.query('INSERT INTO pedidos (idusuarios, status, total) VALUES (?, ?, ?)', [userId, 'pendente', 123.45]);

      const response = await request(app)
        .get('/pedidos')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].idusuarios).toBe(userId);
    });
  });

  describe('POST /pedidos', () => {
    it('deve criar um novo pedido de teste com sucesso', async () => {
      // 1. Preparação: Garantir que existe um produto (ID 999) para o teste
      await db.query(`
        INSERT INTO produtos (id, nome, descricao, preco, estoque, categoria, criado_em) 
        VALUES (999, 'Produto Teste Auto', 'Descrição Teste', 100.00, 50, 'Teste', NOW()) 
        ON DUPLICATE KEY UPDATE estoque = 50
      `);

      // 2. Execução: Enviar requisição para criar o pedido
      const response = await request(app)
        .post('/pedidos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [{ id: 999, quantity: 1 }],
          nome_cliente: 'Cliente Teste Automatizado',
          telefone: '+258 84 000 0000',
          endereco: 'Av. de Testes, 123, Maputo'
        });

      // 3. Verificação
      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.pedidoId).toBeDefined();
    });
  });
});