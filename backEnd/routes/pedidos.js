const express = require('express');
const {
  getAllPedidos,
  getPedidoById,
  createPedido,
  updatePedido,
  deletePedido
} = require('../controllers/pedidosController');

const { auth } = require('../middleware/auth');
const role = require('../middleware/role');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Gerenciamento de pedidos dos usuários
 */

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Retorna os pedidos
 *     description: Retorna a lista de pedidos do usuário logado. Se o usuário for admin, retorna todos os pedidos.
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pedido'
 *       401:
 *         description: Não autorizado (token inválido ou não fornecido).
 */
router.route('/').get(auth, getAllPedidos);

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Retorna um pedido específico pelo ID
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Detalhes do pedido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Pedido não encontrado.
 */
router.route('/:id').get(auth, getPedidoById);

/**
 * @swagger
 * /pedidos:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 default: pendente
 *               total:
 *                 type: number
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso.
 */
router.route('/').post(auth, createPedido);

/**
 * @swagger
 * /pedidos/{id}:
 *   put:
 *     summary: Atualiza o status de um pedido (Admin)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ['pendente', 'processando', 'enviado', 'entregue', 'cancelado']
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso.
 *       403:
 *         description: Acesso negado (não é admin).
 *       404:
 *         description: Pedido não encontrado.
 */
router.route('/:id').put(auth, role('admin'), updatePedido);

/**
 * @swagger
 * /pedidos/{id}:
 *   delete:
 *     summary: Deleta um pedido (Admin)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido removido com sucesso.
 *       403:
 *         description: Acesso negado (não é admin).
 *       404:
 *         description: Pedido não encontrado.
 */
router.route('/:id').delete(auth, role('admin'), deletePedido);

module.exports = router;