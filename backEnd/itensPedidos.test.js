const request = require('supertest');
const app = require('../server');
const db = require('../db');

describe('Endpoints de Itens de Pedidos - /itens', () => {
  let token;
  let userId;
  let pedidoId;
  let produtoId;
  let itemId;

  beforeAll(async () => {
    // Criar usuário de teste
    const randomId = Math.floor(Math.random() * 100000);
    const userRes = await request(app)
      .post('/usuarios')
      .send({
        nome: `Test User ${randomId}`,
        email: `testuser${randomId}@example.com`,
        senha: 'password123',
        role: 'user'
      });

    userId = userRes.body.data.idUsuarios;

    // Fazer login
    const loginRes = await request(app)
      .post('/usuarios/login')
      .send({
        email: `testuser${randomId}@example.com`,
        senha: 'password123'
      });

    token = loginRes.body.data.token;

    // Criar um pedido
    const pedidoRes = await request(app)
      .post('/pedidos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'pendente',
        total: 0
      });

    pedidoId = pedidoRes.body.data.idPedidos;

    // Inserir produto de teste diretamente no BD
    await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO produtos (nome, descricao, preco, estoque) VALUES (?, ?, ?, ?)',
        [`Produto Teste ${randomId}`, 'Descrição teste', 99.99, 100],
        (err, result) => {
          if (err) reject(err);
          produtoId = result.insertId;
          resolve();
        }
      );
    });
  });

  afterAll(async () => {
    if (itemId) {
      await new Promise((resolve) => {
        db.query('DELETE FROM itens_pedidos WHERE id = ?', [itemId], () => resolve());
      });
    }
    if (pedidoId) {
      await new Promise((resolve) => {
        db.query('DELETE FROM pedidos WHERE idPedidos = ?', [pedidoId], () => resolve());
      });
    }
    if (produtoId) {
      await new Promise((resolve) => {
        db.query('DELETE FROM produtos WHERE id = ?', [produtoId], () => resolve());
      });
    }
    await new Promise((resolve) => {
      db.query('DELETE FROM usuarios WHERE idUsuarios = ?', [userId], () => resolve());
    });
    await db.end();
  });

  describe('GET /itens (Listar)', () => {
    it('deve retornar lista de itens de pedidos', async () => {
      const response = await request(app)
        .get('/itens');

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('deve retornar itens com paginação', async () => {
      const response = await request(app)
        .get('/itens?limit=5&page=1');

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /itens (Criar Item)', () => {
    it('deve criar um novo item de pedido', async () => {
      const response = await request(app)
        .post('/itens')
        .set('Authorization', `Bearer ${token}`)
        .send({
          idPedidos: pedidoId,
          idProduto: produtoId,
          quantidade: 2,
          preco_unitario: 99.99
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.idItens).toBeDefined();
      
      itemId = response.body.data.idItens;
    });

    it('deve retornar erro com quantidade inválida', async () => {
      const response = await request(app)
        .post('/itens')
        .set('Authorization', `Bearer ${token}`)
        .send({
          idPedidos: pedidoId,
          idProduto: produtoId,
          quantidade: 0, // Inválido
          preco_unitario: 99.99
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('deve retornar erro sem autenticação', async () => {
      const response = await request(app)
        .post('/itens')
        .send({
          idPedidos: pedidoId,
          idProduto: produtoId,
          quantidade: 1,
          preco_unitario: 99.99
        });

      expect(response.statusCode).toBe(401);
    });

    it('deve retornar erro com campos obrigatórios faltando', async () => {
      const response = await request(app)
        .post('/itens')
        .set('Authorization', `Bearer ${token}`)
        .send({
          idPedidos: pedidoId
          // Campos faltando
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /itens/:id (Obter por ID)', () => {
    it('deve obter um item de pedido por ID válido', async () => {
      if (!itemId) {
        // Criar item se não existir
        const createRes = await request(app)
          .post('/itens')
          .set('Authorization', `Bearer ${token}`)
          .send({
            idPedidos: pedidoId,
            idProduto: produtoId,
            quantidade: 1,
            preco_unitario: 99.99
          });
        
        itemId = createRes.body.data.idItens;
      }

      const response = await request(app)
        .get(`/itens/${itemId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.idItens).toBe(itemId);
    });

    it('deve retornar erro com ID inválido', async () => {
      const response = await request(app)
        .get('/itens/99999');

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /itens/:id (Atualizar)', () => {
    it('deve atualizar um item de pedido', async () => {
      if (!itemId) return;

      const response = await request(app)
        .put(`/itens/${itemId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          quantidade: 5,
          preco_unitario: 89.99
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('deve retornar erro sem autenticação', async () => {
      if (!itemId) return;

      const response = await request(app)
        .put(`/itens/${itemId}`)
        .send({
          quantidade: 3
        });

      expect(response.statusCode).toBe(401);
    });

    it('deve retornar erro ao atualizar item inexistente', async () => {
      const response = await request(app)
        .put('/itens/99999')
        .set('Authorization', `Bearer ${token}`)
        .send({
          quantidade: 1
        });

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /itens/:id (Deletar)', () => {
    it('deve deletar um item de pedido', async () => {
      if (!itemId) return;

      const response = await request(app)
        .delete(`/itens/${itemId}`)
        .set('Authorization', `Bearer ${token}`);

      expect([200, 204]).toContain(response.statusCode);
      expect(response.body.success).toBe(true);

      itemId = null; // Marcar como deletado
    });

    it('deve retornar erro ao deletar item inexistente', async () => {
      const response = await request(app)
        .delete('/itens/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
