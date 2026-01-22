const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/ErrorResponse');
const db = require('../db');
const { logger } = require('../middleware/logger');

// @desc    Obter todos os pedidos
// @route   GET /pedidos
// @access  Privado (Admin ou usuário)
exports.getAllPedidos = asyncHandler(async (req, res, next) => {
    const isAdmin = req.usuario.role === 'admin';

    db.query(
        isAdmin ? 'SELECT * FROM pedidos' : 'SELECT * FROM pedidos WHERE idusuarios = ?',
        isAdmin ? [] : [req.usuario.id],
        (err, pedidos) => {
            if (err) return next(new ErrorResponse('Erro ao buscar pedidos', 500));

            if (isAdmin) {
                logger.info(`Admin ${req.usuario.id} acessou todos os pedidos.`);
            }

            res.status(200).json({ 
                success: true, 
                count: pedidos.length, 
                data: pedidos 
            });
        }
    );
});

// @desc    Obter pedido por ID
// @route   GET /pedidos/:id
// @access  Privado (Admin ou dono)
exports.getPedidoById = asyncHandler(async (req, res, next) => {
    db.query(
        'SELECT * FROM pedidos WHERE idPedidos = ?',
        [req.params.id],
        (err, pedidos) => {
            if (err) return next(new ErrorResponse('Erro ao buscar pedido', 500));

            if (pedidos.length === 0) {
                return next(new ErrorResponse(`Pedido não encontrado com o id ${req.params.id}`, 404));
            }

            const pedido = pedidos[0];

            // Verifica permissão: Admin ou dono
            if (req.usuario.role !== 'admin' && pedido.idusuarios !== req.usuario.id) {
                return next(new ErrorResponse('Não autorizado a acessar este pedido', 403));
            }

            res.status(200).json({ success: true, data: pedido });
        }
    );
});

// @desc    Criar novo pedido
// @route   POST /pedidos
// @access  Privado
exports.createPedido = asyncHandler(async (req, res, next) => {
    const { status, total } = req.body;
    const idusuarios = req.usuario.id;

    db.query(
        'INSERT INTO pedidos (idusuarios, status, total) VALUES (?, ?, ?)',
        [idusuarios, status, total],
        (err, result) => {
            if (err) return next(new ErrorResponse('Erro ao criar pedido', 500));

            logger.info(`Novo pedido #${result.insertId} criado pelo usuário ${idusuarios}`);

            res.status(201).json({
                success: true,
                data: { idPedidos: result.insertId }
            });
        }
    );
});

// @desc    Atualizar pedido
// @route   PUT /pedidos/:id
// @access  Privado (Admin)
exports.updatePedido = asyncHandler(async (req, res, next) => {
    const { status } = req.body;

    if (req.usuario.role !== 'admin') {
        return next(new ErrorResponse('Apenas administradores podem atualizar pedidos', 403));
    }

    db.query(
        'UPDATE pedidos SET status = ? WHERE idPedidos = ?',
        [status, req.params.id],
        (err, result) => {
            if (err) return next(new ErrorResponse('Erro ao atualizar pedido', 500));

            if (result.affectedRows === 0) {
                return next(new ErrorResponse(`Pedido não encontrado com o id ${req.params.id}`, 404));
            }

            res.status(200).json({ 
                success: true, 
                message: 'Pedido atualizado com sucesso' 
            });
        }
    );
});

// @desc    Deletar pedido
// @route   DELETE /pedidos/:id
// @access  Privado (Admin)
exports.deletePedido = asyncHandler(async (req, res, next) => {
    if (req.usuario.role !== 'admin') {
        return next(new ErrorResponse('Não autorizado a deletar pedidos', 403));
    }

    db.query(
        'DELETE FROM pedidos WHERE idPedidos = ?',
        [req.params.id],
        (err, result) => {
            if (err) return next(new ErrorResponse('Erro ao deletar pedido', 500));

            if (result.affectedRows === 0) {
                return next(new ErrorResponse(`Pedido não encontrado com o id ${req.params.id}`, 404));
            }

            res.status(200).json({ 
                success: true, 
                message: 'Pedido removido com sucesso' 
            });
        }
    );
});