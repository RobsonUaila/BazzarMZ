const request = require('supertest');
const app = require('../server'); // Importa a aplicação Express
const db = require('../db');

describe('Endpoints de Pedidos - /pedidos', () => {
  let token;
  let userId;

  // Antes de todos os testes, cria um usuário e faz login para obter um token
  beforeAll(async () => {
    // Garante que o usuário de teste não existe
    await db.query("DELETE FROM usuarios WHERE email = 'testuser@example.com'");

    // Registra um novo usuário
    const userResponse = await request(app)
      .post('/usuarios/register')
      .send({
        nome: 'Test User',
        email: 'testuser@example.com',
        senha: 'password123',
        role: 'user'
      });
    
    // O endpoint de registro precisa retornar o ID do usuário criado
    // Supondo que o controller de usuários foi ajustado para isso
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

  // Depois de todos os testes, limpa o banco de dados
  afterAll(async () => {
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
});