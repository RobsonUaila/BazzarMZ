const request = require('supertest');
const app = require('../server');
const db = require('../db');

describe('Endpoints de Usuários - /usuarios', () => {
  const testUser = {
    nome: 'Test User',
    email: `teste${Date.now()}@example.com`,
    senha: 'password123',
    role: 'user'
  };

  let userId;
  let token;
  let adminToken;

  // Antes de todos os testes
  beforeAll(async () => {
    // Criar usuário admin para testes
    const adminUser = {
      nome: 'Admin Test',
      email: `admin${Date.now()}@example.com`,
      senha: 'admin123',
      role: 'admin'
    };

    // Limpar dados antigos
    await db.query("DELETE FROM usuarios WHERE email LIKE 'teste%@example.com' OR email LIKE 'admin%@example.com'");

    // Registrar usuário admin
    const adminRes = await request(app)
      .post('/usuarios')
      .send(adminUser);

    if (adminRes.status === 201) {
      adminToken = adminRes.body.data.token || 'test_admin_token';
    }
  });

  afterAll(async () => {
    await db.query("DELETE FROM usuarios WHERE email LIKE 'teste%@example.com' OR email LIKE 'admin%@example.com'");
    await db.end();
  });

  describe('POST /usuarios (Registro)', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const response = await request(app)
        .post('/usuarios')
        .send(testUser);

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.nome).toBe(testUser.nome);
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data.role).toBe('user');
      
      userId = response.body.data.idUsuarios;
    });

    it('deve retornar erro ao registrar com email duplicado', async () => {
      const response = await request(app)
        .post('/usuarios')
        .send(testUser);

      expect([400, 409]).toContain(response.statusCode);
      expect(response.body.success).toBe(false);
    });

    it('deve retornar erro com dados inválidos', async () => {
      const response = await request(app)
        .post('/usuarios')
        .send({
          nome: 'Test',
          // Email ausente
          senha: 'password123'
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('deve retornar erro com senha muito curta', async () => {
      const response = await request(app)
        .post('/usuarios')
        .send({
          nome: 'Test User',
          email: `test${Date.now()}@example.com`,
          senha: '123' // Muito curta
        });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /usuarios/login (Login)', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const response = await request(app)
        .post('/usuarios/login')
        .send({
          email: testUser.email,
          senha: testUser.senha
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      
      token = response.body.data.token;
    });

    it('deve retornar erro com email inválido', async () => {
      const response = await request(app)
        .post('/usuarios/login')
        .send({
          email: 'naoexiste@example.com',
          senha: 'password123'
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('deve retornar erro com senha incorreta', async () => {
      const response = await request(app)
        .post('/usuarios/login')
        .send({
          email: testUser.email,
          senha: 'senhaerrada'
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /usuarios (Listar)', () => {
    it('deve retornar lista de usuários sem autenticação', async () => {
      const response = await request(app)
        .get('/usuarios');

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('deve retornar usuários com paginação', async () => {
      const response = await request(app)
        .get('/usuarios?limit=5&page=1');

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /usuarios/:id (Obter por ID)', () => {
    it('deve obter um usuário por ID válido', async () => {
      const response = await request(app)
        .get(`/usuarios/${userId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.idUsuarios).toBe(userId);
    });

    it('deve retornar erro com ID inválido', async () => {
      const response = await request(app)
        .get('/usuarios/99999');

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /usuarios/:id (Atualizar)', () => {
    it('deve atualizar um usuário com dados válidos', async () => {
      const updateData = {
        nome: 'Updated User Name'
      };

      const response = await request(app)
        .put(`/usuarios/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('deve retornar erro ao tentar atualizar usuário inexistente', async () => {
      const response = await request(app)
        .put('/usuarios/99999')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Test' });

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /usuarios/:id (Deletar)', () => {
    let userToDelete;

    beforeAll(async () => {
      // Criar usuário para deletar
      const res = await request(app)
        .post('/usuarios')
        .send({
          nome: 'User to Delete',
          email: `delete${Date.now()}@example.com`,
          senha: 'password123'
        });
      userToDelete = res.body.data.idUsuarios;
    });

    it('deve deletar um usuário com sucesso', async () => {
      const response = await request(app)
        .delete(`/usuarios/${userToDelete}`)
        .set('Authorization', `Bearer ${token}`);

      expect([200, 204]).toContain(response.statusCode);
      expect(response.body.success).toBe(true);
    });

    it('deve retornar erro ao tentar deletar usuário inexistente', async () => {
      const response = await request(app)
        .delete('/usuarios/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
