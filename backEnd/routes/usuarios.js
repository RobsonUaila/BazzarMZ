const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = express.Router();
const pool = require('../db');
const { auth, authorize } = require('../middleware/auth');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');

// FunÃ§Ã£o para enviar o token como cookie
const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({ id: user.id || user.idusuarios, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '24h'
    });

    const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    };
    
    delete user.senha;

    res.status(statusCode)
       .cookie('token', token, options)
       .json({
           success: true,
           token,
           user
       });
};

// @desc    Login de usuÃ¡rio
// @route   POST /api/usuarios/login
router.post('/login', asyncHandler(async (req, res, next) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return next(new ErrorResponse('Por favor, forneÃ§a email e senha', 400));
    }

    const sql = 'SELECT * FROM usuarios WHERE email = ?';
    pool.query(sql, [email], async (err, results) => {
        if (err) return next(new ErrorResponse('Erro de servidor', 500));
        if (results.length === 0) return next(new ErrorResponse('Credenciais invÃ¡lidas', 401));

        const user = results[0];

        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) return next(new ErrorResponse('Credenciais invÃ¡lidas', 401));

        sendTokenResponse(user, 200, res);
    });
}));

// @desc    Registrar usuÃ¡rio
// @route   POST /api/usuarios
router.post('/', asyncHandler(async (req, res, next) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return next(new ErrorResponse('Por favor, forneÃ§a nome, email e senha', 400));
    }

    if (senha.length < 6) {
        return next(new ErrorResponse('A senha deve ter pelo menos 6 caracteres', 400));
    }

    const emailTrim = String(email).trim().toLowerCase();
    const nomeTrim = String(nome).trim();

    const checkSql = 'SELECT idusuarios FROM usuarios WHERE email = ?';
    pool.query(checkSql, [emailTrim], async (err, results) => {
        if (err) return next(new ErrorResponse('Erro de servidor', 500));
        if (results.length > 0) return next(new ErrorResponse('Email jÃ¡ cadastrado', 409));

        try {
            const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
            const hashedPassword = await bcrypt.hash(senha, saltRounds);
            const role = 'user';

            const insertSql = 'INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)';
            pool.query(insertSql, [nomeTrim, emailTrim, hashedPassword, role], (err, result) => {
                if (err) return next(new ErrorResponse('Erro ao criar usuÃ¡rio', 500));

                res.status(201).json({
                    success: true,
                    message: 'UsuÃ¡rio criado com sucesso',
                    user: {
                        id: result.insertId,
                        nome: nomeTrim,
                        email: emailTrim,
                        role
                    }
                });
            });
        } catch (hashError) {
            return next(new ErrorResponse('Erro ao criptografar a senha', 500));
        }
    });
}));
// @desc    Verificar usuÃ¡rio atual (SessÃ£o)
// @route   GET /api/usuarios/me
// @access  Private
router.get('/me', auth, asyncHandler(async (req, res, next) => {
    const sql = 'SELECT idusuarios as id, nome, email, role FROM usuarios WHERE idusuarios = ?';
    pool.query(sql, [req.user.id], (err, results) => {
        if (err) return next(new ErrorResponse('Erro ao buscar dados do usuÃ¡rio', 500));
        res.status(200).json({
            success: true,
            data: results[0]
        });
    });
}));

// @desc    Atualizar dados do usuÃ¡rio atual
// @route   PUT /api/usuarios/me
// @access  Private
router.put('/me', auth, asyncHandler(async (req, res, next) => {
    const { nome, email } = req.body;
    const updates = [];
    const values = [];

    if (nome && String(nome).trim()) {
        updates.push('nome = ?');
        values.push(String(nome).trim());
    }

    if (email && String(email).trim()) {
        updates.push('email = ?');
        values.push(String(email).trim().toLowerCase());
    }

    if (updates.length === 0) {
        return next(new ErrorResponse('Nenhum dado vÃ¡lido para atualizar', 400));
    }

    const sql = `UPDATE usuarios SET ${updates.join(', ')} WHERE idusuarios = ?`;
    values.push(req.user.id);

    pool.query(sql, values, (err) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return next(new ErrorResponse('Email jÃ¡ cadastrado', 409));
            }
            return next(new ErrorResponse('Erro ao atualizar usuÃ¡rio', 500));
        }

        res.status(200).json({ success: true, message: 'Perfil atualizado com sucesso' });
    });
}));

// @desc    Get all users
// @route   GET /api/usuarios
// @access  Private/Admin
router.get('/', auth, authorize('admin'), asyncHandler(async (req, res, next) => {
    const sql = 'SELECT idusuarios as id, nome, email, role FROM usuarios ORDER BY idusuarios DESC';
    pool.query(sql, (err, results) => {
        if (err) {
            return next(new ErrorResponse('Erro ao buscar usuÃ¡rios', 500));
        }
        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    });
}));

// @desc    Update user role
// @route   PUT /api/usuarios/:id/role
// @access  Private/Admin
router.put('/:id/role', auth, authorize('admin'), asyncHandler(async (req, res, next) => {
    const { role } = req.body;
    const { id } = req.params;

    if (!role || !['admin', 'user'].includes(role)) {
        return next(new ErrorResponse('Cargo invÃ¡lido', 400));
    }

    const sql = 'UPDATE usuarios SET role = ? WHERE idusuarios = ?';
    pool.query(sql, [role, id], (err, result) => {
        if (err) {
            return next(new ErrorResponse('Erro ao atualizar cargo do usuÃ¡rio', 500));
        }
        if (result.affectedRows === 0) {
            return next(new ErrorResponse('UsuÃ¡rio nÃ£o encontrado', 404));
        }
        res.status(200).json({ success: true, message: 'Cargo atualizado com sucesso' });
    });
}));

// @desc    Delete user
// @route   DELETE /api/usuarios/:id
// @access  Private/Admin
router.delete('/:id', auth, authorize('admin'), asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (req.user.id === parseInt(id, 10)) {
        return next(new ErrorResponse('VocÃª nÃ£o pode apagar sua prÃ³pria conta de administrador.', 400));
    }

    const sql = 'DELETE FROM usuarios WHERE idusuarios = ?';
    pool.query(sql, [id], (err, result) => {
        if (err) {
            if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                return next(new ErrorResponse('NÃ£o Ã© possÃ­vel apagar este usuÃ¡rio pois ele possui pedidos associados.', 400));
            }
            return next(new ErrorResponse('Erro ao apagar usuÃ¡rio', 500));
        }
        if (result.affectedRows === 0) {
            return next(new ErrorResponse('UsuÃ¡rio nÃ£o encontrado', 404));
        }
        res.status(200).json({ success: true, message: 'UsuÃ¡rio apagado com sucesso' });
    });
}));

// @desc    Forgot password
// @route   POST /api/usuarios/forgotpassword
router.post('/forgotpassword', asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    const sql = 'SELECT * FROM usuarios WHERE email = ?';
    pool.query(sql, [email], (err, results) => {
        if (err || results.length === 0) {
            // Resposta genÃ©rica para nÃ£o revelar se um email existe ou nÃ£o
            return res.status(200).json({ success: true, data: 'Email enviado se o usuÃ¡rio existir.' });
        }

        const user = results[0];
        const resetToken = crypto.randomBytes(20).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const expireDate = Date.now() + 10 * 60 * 1000; // 10 minutos

        const updateSql = 'UPDATE usuarios SET resetPasswordToken = ?, resetPasswordExpire = ? WHERE id = ?';
        pool.query(updateSql, [hashedToken, new Date(expireDate), user.id], async (err, result) => {
            if (err) return next(new ErrorResponse('Erro ao salvar token de reset', 500));

            // CORREÃ‡ÃƒO: A URL deve apontar para o frontend.
            const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
            const message = `VocÃª solicitou a redefiniÃ§Ã£o da sua senha. Por favor, clique no link a seguir para completar o processo:\n\n${resetUrl}\n\nSe vocÃª nÃ£o solicitou isso, ignore este email.`;

            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: process.env.SMTP_PORT,
                    auth: { user: process.env.SMTP_EMAIL, pass: process.env.SMTP_PASSWORD },
                });

                await transporter.sendMail({
                    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
                    to: user.email,
                    subject: 'RedefiniÃ§Ã£o de Senha - BazzarMZ',
                    text: message,
                });

                res.status(200).json({ success: true, data: 'Email enviado' });
            } catch (emailError) {
                console.error(emailError);
                pool.query('UPDATE usuarios SET resetPasswordToken = NULL, resetPasswordExpire = NULL WHERE id = ?', [user.id]);
                return next(new ErrorResponse('NÃ£o foi possÃ­vel enviar o email', 500));
            }
        });
    });
}));

// @desc    Reset password
// @route   PUT /api/usuarios/resetpassword/:resettoken
router.put('/resetpassword/:resettoken', asyncHandler(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const sql = 'SELECT * FROM usuarios WHERE resetPasswordToken = ? AND resetPasswordExpire > NOW()';
    pool.query(sql, [resetPasswordToken], async (err, results) => {
        if (err || results.length === 0) {
            return next(new ErrorResponse('Token invÃ¡lido ou expirado', 400));
        }

        const user = results[0];
        const { senha } = req.body;
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(senha, salt);

        const updateSql = 'UPDATE usuarios SET senha = ?, resetPasswordToken = NULL, resetPasswordExpire = NULL WHERE id = ?';
        pool.query(updateSql, [newHashedPassword, user.id], (err, result) => {
            if (err) return next(new ErrorResponse('Erro ao redefinir a senha', 500));
            sendTokenResponse(user, 200, res);
        });
    });
}));

module.exports = router;

