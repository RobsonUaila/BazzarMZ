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
  // Adicionar mais testes para POST, GET by ID, PUT, DELETE
});