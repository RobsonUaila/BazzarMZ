const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth, authorize } = require('../middleware/auth');
const ErrorResponse = require('../utils/ErrorResponse');
const pool = require('../db');
const Joi = require('joi');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configuração do Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();

const FILE_SIZE_LIMIT_MB = 30;
const FILE_SIZE_LIMIT_BYTES = FILE_SIZE_LIMIT_MB * 1024 * 1024;

const upload = multer({ 
    storage,
    limits: { fileSize: FILE_SIZE_LIMIT_BYTES },
});

const uploadFields = upload.fields([
    { name: 'imagem_capa', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
    { name: 'imagem', maxCount: 1 },
    { name: 'gifs', maxCount: 5 }
]);

// Middleware para tratar erros do Multer
const handleUploadErrors = (req, res, next) => {
    uploadFields(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return next(new ErrorResponse(`Ficheiro demasiado grande. O limite é de ${FILE_SIZE_LIMIT_MB}MB.`, 400));
                }
                return next(new ErrorResponse(`Erro de upload: ${err.message}`, 400));
            }
            console.error('❌ Erro durante o upload (não-Multer):', err);
            return next(new ErrorResponse(err.message || 'Ocorreu um erro inesperado durante o upload.', 500));
        }
        next();
    });
};

// Middleware para upload direto para o Cloudinary
const uploadToCloudinary = async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) return next();

    const uploadStream = (file) => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'bazarmz_produtos',
                    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
                },
                (error, result) => {
                    if (result) {
                        file.path = result.secure_url;
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            );
            streamifier.createReadStream(file.buffer).pipe(stream);
        });
    };

    try {
        const promises = [];
        Object.keys(req.files).forEach(key => {
            req.files[key].forEach(file => {
                promises.push(uploadStream(file));
            });
        });

        await Promise.all(promises);
        next();
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        next(new ErrorResponse('Erro ao fazer upload de imagens.', 500));
    }
};

// POST - Criar novo produto (admin, partner)
router.post('/', auth, authorize('admin', 'partner'), handleUploadErrors, uploadToCloudinary, (req, res, next) => {
    try {
        const schema = Joi.object({
            nome: Joi.string().required().messages({'any.required': 'O nome é obrigatório'}),
            descricao: Joi.string().allow('', null),
            preco: Joi.number().min(0).required().messages({'number.base': 'Preço inválido'}),
            categoria: Joi.string().allow('', null),
            estoque: Joi.number().integer().min(0).default(0)
        }).unknown(true);

        const { error, value } = schema.validate(req.body);

        if (error) {
            return next(new ErrorResponse(`Dados inválidos: ${error.details[0].message}`, 400));
        }

        const { nome, descricao, preco, categoria, estoque } = value;

        const imagemCapa = req.files?.imagem_capa?.[0]?.path || null;
        const thumbnail = req.files?.thumbnail?.[0]?.path || req.files?.imagem?.[0]?.path || null;

        let finalDescricao = descricao;
        if (req.files?.gifs && req.files.gifs.length > 0) {
            const gifTags = req.files.gifs.map(file => 
                `<br /><br /><img src="${file.path}" alt="GIF do produto" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0;" />`
            ).join('');
            finalDescricao += gifTags;
        }

        const sql = `
            INSERT INTO produtos (nome, descricao, preco, categoria, estoque, imagem_capa, thumbnail, vendedor_id, criado_em)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        pool.query(sql, [nome, finalDescricao, preco, categoria, estoque || 0, imagemCapa, thumbnail, req.user.id], (err, results) => {
            if (err) {
                console.error('❌ Erro SQL ao criar produto:', err);
                return next(new ErrorResponse(`Erro ao criar produto: ${err.message}`, 500));
            }
            res.status(201).json({
                success: true,
                message: 'Produto criado com sucesso',
                produtoId: results.insertId
            });
        });
    } catch (error) {
        next(error);
    }
});

// GET - Listar produtos com paginação
router.get('/', (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;
        const categoria = req.query.categoria;
        const search = req.query.search;
        const vendedor_id = req.query.vendedor_id; // Novo filtro para parceiros

        let sql = 'SELECT * FROM produtos WHERE 1=1';
        const params = [];

        if (categoria) {
            sql += ' AND categoria = ?';
            params.push(categoria);
        }

        if (search) {
            sql += ' AND (nome LIKE ? OR descricao LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        
        if (vendedor_id) {
            sql += ' AND vendedor_id = ?';
            params.push(vendedor_id);
        }

        sql += ' ORDER BY criado_em DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        pool.query(sql, params, (err, produtos) => {
            if (err) {
                return next(new ErrorResponse(`Erro ao buscar produtos: ${err.message}`, 500));
            }

            let countSql = 'SELECT COUNT(*) as total FROM produtos WHERE 1=1';
            const countParams = [];

            if (categoria) {
                countSql += ' AND categoria = ?';
                countParams.push(categoria);
            }

            if (search) {
                countSql += ' AND (nome LIKE ? OR descricao LIKE ?)';
                countParams.push(`%${search}%`, `%${search}%`);
            }
            
            if (vendedor_id) {
                countSql += ' AND vendedor_id = ?';
                countParams.push(vendedor_id);
            }

            pool.query(countSql, countParams, (err, count) => {
                if (err) {
                    return next(new ErrorResponse(`Erro ao contar produtos: ${err.message}`, 500));
                }

                res.json({
                    success: true,
                    data: produtos,
                    pagination: {
                        total: count[0].total,
                        page,
                        limit,
                        pages: Math.ceil(count[0].total / limit)
                    }
                });
            });
        });
    } catch (error) {
        next(error);
    }
});

// GET - Obter produto por ID
router.get('/:id', (req, res, next) => {
    try {
        const sql = 'SELECT * FROM produtos WHERE id = ?';
        pool.query(sql, [req.params.id], (err, results) => {
            if (err) {
                return next(new ErrorResponse(`Erro ao buscar produto: ${err.message}`, 500));
            }
            if (!results.length) {
                return next(new ErrorResponse('Produto não encontrado', 404));
            }
            res.json({
                success: true,
                data: results[0]
            });
        });
    } catch (error) {
        next(error);
    }
});

// PUT - Atualizar produto (admin, partner)
router.put('/:id', auth, authorize('admin', 'partner'), handleUploadErrors, uploadToCloudinary, (req, res, next) => {
    try {
        const { nome, descricao, preco, categoria, estoque } = req.body;

        let sql = 'UPDATE produtos SET nome=?, descricao=?, preco=?, categoria=?, estoque=?';
        const params = [nome, descricao, preco, categoria, estoque || 0];

        if (req.files?.imagem_capa?.[0]) {
            sql += ', imagem_capa=?';
            params.push(req.files.imagem_capa[0].path);
        }

        if (req.files?.thumbnail?.[0]) {
            sql += ', thumbnail=?';
            params.push(req.files.thumbnail[0].path);
        } else if (req.files?.imagem?.[0]) {
            sql += ', thumbnail=?';
            params.push(req.files.imagem[0].path);
        }

        sql += ' WHERE id=?';
        params.push(req.params.id);
        
        // Se for partner, sÃ³ pode atualizar os prÃ³prios produtos
        if (req.user.role === 'partner') {
            sql += ' AND vendedor_id=?';
            params.push(req.user.id);
        }

        pool.query(sql, params, (err, results) => {
            if (err) {
                return next(new ErrorResponse(`Erro ao atualizar produto: ${err.message}`, 500));
            }
            if (results.affectedRows === 0) {
                return next(new ErrorResponse('Produto não encontrado ou acesso negado', 404));
            }
            res.json({
                success: true,
                message: 'Produto atualizado com sucesso'
            });
        });
    } catch (error) {
        next(error);
    }
});

// DELETE - Deletar produto (admin, partner)
router.delete('/:id', auth, authorize('admin', 'partner'), (req, res, next) => {
    const produtoId = req.params.id;
    const userId = req.user.id;
    const isPartner = req.user.role === 'partner';

    // Primeiro verificar se o produto pertence ao parceiro (se for parceiro)
    const checkSql = 'SELECT vendedor_id FROM produtos WHERE id = ?';
    pool.query(checkSql, [produtoId], (err, results) => {
        if (err) return next(new ErrorResponse(`Erro ao verificar produto: ${err.message}`, 500));
        if (results.length === 0) return next(new ErrorResponse('Produto não encontrado', 404));
        
        if (isPartner && results[0].vendedor_id !== userId) {
            return next(new ErrorResponse('Acesso negado: Você só pode deletar os seus próprios produtos', 403));
        }

        // Remover dependências (Reviews e Wishlist) antes de apagar o produto
        const deleteReviews = 'DELETE FROM reviews WHERE produto_id = ?';
        const deleteWishlist = 'DELETE FROM wishlist WHERE produto_id = ?';
        const deleteProduto = 'DELETE FROM produtos WHERE id = ?';

        pool.query(deleteReviews, [produtoId], (err) => {
            if (err) return next(new ErrorResponse(`Erro ao apagar reviews: ${err.message}`, 500));

            pool.query(deleteWishlist, [produtoId], (err) => {
                if (err) return next(new ErrorResponse(`Erro ao apagar wishlist: ${err.message}`, 500));

                pool.query(deleteProduto, [produtoId], (err, results) => {
                    if (err) {
                        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                            return next(new ErrorResponse('Não é possível apagar este produto pois ele faz parte de pedidos realizados.', 400));
                        }
                        return next(new ErrorResponse(`Erro ao deletar produto: ${err.message}`, 500));
                    }
                    res.json({
                        success: true,
                        message: 'Produto deletado com sucesso'
                    });
                });
            });
        });
    });
});

// GET - Listar reviews de um produto
router.get('/:id/reviews', (req, res, next) => {
    const sql = 'SELECT * FROM reviews WHERE produto_id = ? ORDER BY data_criacao DESC';
    pool.query(sql, [req.params.id], (err, results) => {
        if (err) return next(new ErrorResponse(`Erro ao buscar reviews: ${err.message}`, 500));
        res.json(results);
    });
});

// POST - Criar review (Requer login)
router.post('/:id/reviews', auth, (req, res, next) => {
    const { rating, comment } = req.body;
    const usuario_nome = req.user ? req.user.nome : 'Anônimo';
    
    if (!rating || !comment) {
        return next(new ErrorResponse('Avaliação e comentário são obrigatórios', 400));
    }

    const sql = 'INSERT INTO reviews (produto_id, usuario_nome, rating, comentario) VALUES (?, ?, ?, ?)';
    pool.query(sql, [req.params.id, usuario_nome, rating, comment], (err, results) => {
        if (err) return next(new ErrorResponse(`Erro ao salvar review: ${err.message}`, 500));
        res.status(201).json({
            success: true,
            message: 'Avaliação salva com sucesso'
        });
    });
});

module.exports = router;
