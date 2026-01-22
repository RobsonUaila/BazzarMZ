const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/ErrorResponse');
const db = require('../db');

// @desc    Obter todos os itens
// @route   GET /itens-pedidos
// @access  Privado
exports.getAllItens = asyncHandler(async (req, res, next) => {
    db.query('SELECT * FROM itens_pedidos', (err, itens) => {
        if (err) return next(new ErrorResponse('Erro ao buscar itens', 500));

        res.status(200).json({ 
            success: true, 
            count: itens.length, 
            data: itens 
        });
    });
});

// @desc    Obter item por ID
// @route   GET /itens-pedidos/:id
// @access  Privado (Admin ou dono)
exports.getItemById = asyncHandler(async (req, res, next) => {
    const sql = `
        SELECT i.*, p.idusuarios 
        FROM itens_pedidos i 
        JOIN pedidos p ON i.pedidos_id = p.idPedidos 
        WHERE i.idItem = ?
    `;

    db.query(sql, [req.params.id], (err, results) => {
        if (err) return next(new ErrorResponse('Erro ao buscar item', 500));

        if (results.length === 0) {
            return next(new ErrorResponse('Item não encontrado', 404));
        }

        const item = results[0];

        // Verifica permissão: Admin ou dono
        if (req.usuario.role !== 'admin' && item.idusuarios !== req.usuario.id) {
            return next(new ErrorResponse('Acesso negado', 403));
        }

        delete item.idusuarios;

        res.status(200).json({ success: true, data: item });
    });
});

// @desc    Criar novo item
// @route   POST /itens-pedidos
// @access  Privado
exports.createItem = asyncHandler(async (req, res, next) => {
    const { idPedidos, idProduto, quantidade, preco_unitario } = req.body;

    db.query(
        'INSERT INTO itens_pedidos (pedidos_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
        [idPedidos, idProduto, quantidade, preco_unitario],
        (err, result) => {
            if (err) return next(new ErrorResponse('Erro ao criar item', 500));

            res.status(201).json({ 
                success: true, 
                data: { idItem: result.insertId } 
            });
        }
    );
});

// @desc    Atualizar item
// @route   PUT /itens-pedidos/:id
// @access  Privado (Admin ou dono)
exports.updateItem = asyncHandler(async (req, res, next) => {
    const { quantidade } = req.body;

    const sqlSelect = `
        SELECT i.*, p.idusuarios 
        FROM itens_pedidos i 
        JOIN pedidos p ON i.pedidos_id = p.idPedidos 
        WHERE i.idItem = ?
    `;

    db.query(sqlSelect, [req.params.id], (err, results) => {
        if (err) return next(new ErrorResponse('Erro ao buscar item', 500));

        if (results.length === 0) {
            return next(new ErrorResponse('Item não encontrado', 404));
        }

        const item = results[0];
        if (req.usuario.role !== 'admin' && item.idusuarios !== req.usuario.id) {
            return next(new ErrorResponse('Acesso negado', 403));
        }

        db.query(
            'UPDATE itens_pedidos SET quantidade = ? WHERE idItem = ?',
            [quantidade, req.params.id],
            (err, updateResult) => {
                if (err) return next(new ErrorResponse('Erro ao atualizar item', 500));

                if (updateResult.affectedRows === 0) {
                    return next(new ErrorResponse('Erro ao atualizar item', 500));
                }

                res.status(200).json({ 
                    success: true, 
                    message: 'Item atualizado com sucesso' 
                });
            }
        );
    });
});

// @desc    Deletar item
// @route   DELETE /itens-pedidos/:id
// @access  Privado (Admin ou dono)
exports.deleteItem = asyncHandler(async (req, res, next) => {
    const sqlSelect = `
        SELECT i.*, p.idusuarios 
        FROM itens_pedidos i 
        JOIN pedidos p ON i.pedidos_id = p.idPedidos 
        WHERE i.idItem = ?
    `;

    db.query(sqlSelect, [req.params.id], (err, results) => {
        if (err) return next(new ErrorResponse('Erro ao buscar item', 500));

        if (results.length === 0) {
            return next(new ErrorResponse('Item não encontrado', 404));
        }

        const item = results[0];
        if (req.usuario.role !== 'admin' && item.idusuarios !== req.usuario.id) {
            return next(new ErrorResponse('Acesso negado', 403));
        }

        db.query(
            'DELETE FROM itens_pedidos WHERE idItem = ?',
            [req.params.id],
            (err, deleteResult) => {
                if (err) return next(new ErrorResponse('Erro ao deletar item', 500));

                if (deleteResult.affectedRows === 0) {
                    return next(new ErrorResponse('Erro ao deletar item', 500));
                }

                res.status(200).json({ 
                    success: true, 
                    message: 'Item removido com sucesso' 
                });
            }
        );
    });
});