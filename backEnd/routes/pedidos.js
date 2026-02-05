const express = require('express');
const router = express.Router();
const pool = require('../db');
const { auth, authorize } = require('../middleware/auth');
const ErrorResponse = require('../utils/ErrorResponse');

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
router.get('/', auth, (req, res, next) => {
    const usuarioId = req.user.id;
    const sql = `
        SELECT p.id, p.data_pedido, p.status, p.total, p.trackingNumber,
               JSON_ARRAYAGG(JSON_OBJECT('name', prod.nome, 'quantity', ip.quantidade, 'price', ip.preco_unitario)) as items
        FROM pedidos p
        JOIN itens_pedidos ip ON p.id = ip.pedido_id
        JOIN produtos prod ON ip.produto_id = prod.id
        WHERE p.usuario_id = ?
        GROUP BY p.id
        ORDER BY p.data_pedido DESC
    `;
    pool.query(sql, [usuarioId], (err, results) => {
        if (err) return next(new ErrorResponse('Erro ao buscar seus pedidos', 500));
        res.json({ success: true, data: results });
    });
});

// Rota específica para "Meus Pedidos" (redundante com GET /, mas útil para clareza no frontend)
router.get('/my-orders', auth, (req, res, next) => {
    const idusuarios = req.user.id;
    const sql = `
        SELECT p.id, p.data_pedido, p.status, p.total, p.trackingNumber,
               JSON_ARRAYAGG(JSON_OBJECT('name', prod.nome, 'quantity', ip.quantidade, 'price', ip.preco_unitario)) as items
        FROM pedidos p
        JOIN itens_pedidos ip ON p.id = ip.pedido_id
        JOIN produtos prod ON ip.produto_id = prod.id
        WHERE p.usuario_id = ?
        GROUP BY p.id
        ORDER BY p.data_pedido DESC
    `;
    pool.query(sql, [idusuarios], (err, results) => {
        if (err) return next(new ErrorResponse('Erro ao buscar seus pedidos', 500));
        res.json({ success: true, data: results });
    });
});

// Rota para Admin listar TODOS os pedidos
router.get('/all', auth, authorize('admin'), (req, res, next) => {
    const sql = `
        SELECT 
            p.id, p.data_pedido, p.status, p.total,
            p.nome_cliente, p.telefone, p.endereco
        FROM pedidos p
        ORDER BY p.data_pedido DESC
    `;
    pool.query(sql, (err, pedidos) => {
        if (err) return next(new ErrorResponse('Erro ao buscar todos os pedidos', 500));
        res.json({ success: true, data: pedidos });
    });
});

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
router.get('/:id', auth, (req, res, next) => {
    const sql = 'SELECT * FROM pedidos WHERE id = ?';
    pool.query(sql, [req.params.id], (err, results) => {
        if (err) return next(new ErrorResponse('Erro ao buscar pedido', 500));
        if (results.length === 0) return next(new ErrorResponse('Pedido não encontrado', 404));
        
        // Aqui poderia buscar os itens também se necessário
        res.json({ success: true, data: results[0] });
    });
});

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
router.post('/', auth, (req, res, next) => { // Rota para criar um novo pedido
    const { items, nome_cliente, telefone, endereco } = req.body;
    const usuario_id = req.user.id;

    // Validação inicial
    if (!items || !Array.isArray(items) || items.length === 0) {
        return next(new ErrorResponse('O pedido deve conter itens.', 400));
    }

    const productIds = items.map(item => item.id);

    // Busca os preços e estoques reais dos produtos no banco de dados
    const getPricesSql = 'SELECT id, preco, nome, estoque FROM produtos WHERE id IN (?)';
    pool.query(getPricesSql, [productIds], (err, productsFromDb) => {
        if (err) {
            return next(new ErrorResponse('Erro ao verificar produtos no banco de dados.', 500));
        }

        // Garante que todos os produtos solicitados existem
        if (productsFromDb.length !== productIds.length) {
            const foundIds = productsFromDb.map(p => p.id);
            const missingIds = productIds.filter(id => !foundIds.includes(id));
            return next(new ErrorResponse(`Os seguintes produtos não foram encontrados: ID ${missingIds.join(', ')}.`, 404));
        }

        const priceMap = new Map();
        productsFromDb.forEach(p => priceMap.set(p.id, { preco: p.preco, nome: p.nome, estoque: p.estoque }));

        let serverTotal = 0;
        const finalItemsForInsert = [];

        // Valida estoque e calcula o total do lado do servidor para evitar manipulação de preço
        for (const item of items) {
            const productInfo = priceMap.get(item.id);

            if (productInfo.estoque < item.quantity) {
                return next(new ErrorResponse(`Estoque insuficiente para o produto "${productInfo.nome}". Apenas ${productInfo.estoque} disponíveis.`, 400));
            }

            const itemPrice = parseFloat(productInfo.preco);
            serverTotal += item.quantity * itemPrice;
            finalItemsForInsert.push([item.id, item.quantity, itemPrice]);
        }

        // Inicia a transação para garantir a atomicidade da operação
        pool.getConnection((err, connection) => {
            if (err) return next(new ErrorResponse('Erro de conexão com o banco de dados.', 500));

            connection.beginTransaction(err => {
                if (err) {
                    connection.release();
                    return next(new ErrorResponse('Erro ao iniciar transação.', 500));
                }

                // 1. Insere o pedido com o total calculado no servidor
                const pedidoSql = `INSERT INTO pedidos (usuario_id, total, status, nome_cliente, telefone, endereco, data_pedido) VALUES (?, ?, 'processando', ?, ?, ?, NOW())`;
                connection.query(pedidoSql, [usuario_id, serverTotal, nome_cliente, telefone, endereco], (err, results) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            next(new ErrorResponse(`Erro ao criar o registo do pedido: ${err.message}`, 500));
                        });
                    }

                    const pedidoId = results.insertId;

                    // 2. Insere os itens do pedido com os preços corretos do banco de dados
                    const itensSql = 'INSERT INTO itens_pedidos (pedido_id, produto_id, quantidade, preco_unitario) VALUES ?';
                    const itensValues = finalItemsForInsert.map(itemData => [pedidoId, ...itemData]);

                    connection.query(itensSql, [itensValues], (err, results) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                next(new ErrorResponse('Erro ao inserir os itens do pedido.', 500));
                            });
                        }

                        // 3. Atualiza o estoque de cada produto
                        // Esta operação é feita em loop, mas dentro da mesma transação
                        let completedUpdates = 0;
                        items.forEach(item => {
                            const updateStockSql = 'UPDATE produtos SET estoque = estoque - ? WHERE id = ? AND estoque >= ?';
                            connection.query(updateStockSql, [item.quantity, item.id, item.quantity], (err, result) => {
                                if (err || result.affectedRows === 0) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        const errorMsg = err ? 'Erro ao atualizar o estoque.' : `Estoque para o produto ID ${item.id} tornou-se insuficiente.`;
                                        next(new ErrorResponse(errorMsg, 500));
                                    });
                                }

                                completedUpdates++;
                                if (completedUpdates === items.length) {
                                    // 4. Se tudo correu bem, comita a transação
                                    connection.commit(err => {
                                        if (err) {
                                            return connection.rollback(() => {
                                                connection.release();
                                                next(new ErrorResponse('Erro ao finalizar a transação do pedido.', 500));
                                            });
                                        }
                                        connection.release();
                                        res.status(201).json({ success: true, message: 'Pedido criado com sucesso!', pedidoId });
                                    });
                                }
                            });
                        });
                    });
                });
            });
        });
    });
});

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
router.put('/:id/status', auth, authorize('admin'), (req, res, next) => {
    const { status } = req.body;
    const { id } = req.params;

    const allowedStatus = ['processando', 'enviado', 'entregue', 'cancelado'];
    if (!status || !allowedStatus.includes(status)) {
        return next(new ErrorResponse('Status fornecido é inválido', 400));
    }

    const sql = 'UPDATE pedidos SET status = ? WHERE id = ?';
    pool.query(sql, [status, id], (err, results) => {
        if (err) return next(new ErrorResponse('Erro ao atualizar status do pedido', 500));
        if (results.affectedRows === 0) return next(new ErrorResponse('Pedido não encontrado', 404));
        
        res.json({ success: true, message: 'Status do pedido atualizado com sucesso' });
    });
});

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
router.delete('/:id', auth, authorize('admin'), (req, res, next) => {
    const sql = 'DELETE FROM pedidos WHERE id = ?';
    pool.query(sql, [req.params.id], (err, results) => {
        if (err) return next(new ErrorResponse('Erro ao deletar pedido', 500));
        if (results.affectedRows === 0) return next(new ErrorResponse('Pedido não encontrado', 404));
        res.json({ success: true, message: 'Pedido removido com sucesso' });
    });
});

module.exports = router;