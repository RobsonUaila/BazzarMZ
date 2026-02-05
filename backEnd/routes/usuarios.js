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

// Função para enviar o token como cookie
const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '1h'
    });

    const options = {
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000), 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
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

// @desc    Login de usuário
// @route   POST /api/usuarios/login
router.post('/login', asyncHandler(async (req, res, next) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return next(new ErrorResponse('Por favor, forneça email e senha', 400));
    }

    const sql = 'SELECT * FROM usuarios WHERE email = ?';
    pool.query(sql, [email], async (err, results) => {
        if (err) return next(new ErrorResponse('Erro de servidor', 500));
        if (results.length === 0) return next(new ErrorResponse('Credenciais inválidas', 401));

        const user = results[0];

        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) return next(new ErrorResponse('Credenciais inválidas', 401));

        sendTokenResponse(user, 200, res);
    });
}));

// @desc    Get all users
// @route   GET /api/usuarios
// @access  Private/Admin
router.get('/', auth, authorize('admin'), asyncHandler(async (req, res, next) => {
    const sql = 'SELECT id, nome, email, role, data_criacao FROM usuarios ORDER BY data_criacao DESC';
    pool.query(sql, (err, results) => {
        if (err) {
            return next(new ErrorResponse('Erro ao buscar usuários', 500));
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
        return next(new ErrorResponse('Cargo inválido', 400));
    }

    const sql = 'UPDATE usuarios SET role = ? WHERE id = ?';
    pool.query(sql, [role, id], (err, result) => {
        if (err) {
            return next(new ErrorResponse('Erro ao atualizar cargo do usuário', 500));
        }
        if (result.affectedRows === 0) {
            return next(new ErrorResponse('Usuário não encontrado', 404));
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
        return next(new ErrorResponse('Você não pode apagar sua própria conta de administrador.', 400));
    }

    const sql = 'DELETE FROM usuarios WHERE id = ?';
    pool.query(sql, [id], (err, result) => {
        if (err) {
            if (err.code === 'ER_ROW_IS_REFERENCED_2') {
                return next(new ErrorResponse('Não é possível apagar este usuário pois ele possui pedidos associados.', 400));
            }
            return next(new ErrorResponse('Erro ao apagar usuário', 500));
        }
        if (result.affectedRows === 0) {
            return next(new ErrorResponse('Usuário não encontrado', 404));
        }
        res.status(200).json({ success: true, message: 'Usuário apagado com sucesso' });
    });
}));

// @desc    Forgot password
// @route   POST /api/usuarios/forgotpassword
router.post('/forgotpassword', asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    const sql = 'SELECT * FROM usuarios WHERE email = ?';
    pool.query(sql, [email], (err, results) => {
        if (err || results.length === 0) {
            // Resposta genérica para não revelar se um email existe ou não
            return res.status(200).json({ success: true, data: 'Email enviado se o usuário existir.' });
        }

        const user = results[0];
        const resetToken = crypto.randomBytes(20).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const expireDate = Date.now() + 10 * 60 * 1000; // 10 minutos

        const updateSql = 'UPDATE usuarios SET resetPasswordToken = ?, resetPasswordExpire = ? WHERE id = ?';
        pool.query(updateSql, [hashedToken, new Date(expireDate), user.id], async (err, result) => {
            if (err) return next(new ErrorResponse('Erro ao salvar token de reset', 500));

            // CORREÇÃO: A URL deve apontar para o frontend.
            const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
            const message = `Você solicitou a redefinição da sua senha. Por favor, clique no link a seguir para completar o processo:\n\n${resetUrl}\n\nSe você não solicitou isso, ignore este email.`;

            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: process.env.SMTP_PORT,
                    auth: { user: process.env.SMTP_EMAIL, pass: process.env.SMTP_PASSWORD },
                });

                await transporter.sendMail({
                    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
                    to: user.email,
                    subject: 'Redefinição de Senha - BazzarMZ',
                    text: message,
                });

                res.status(200).json({ success: true, data: 'Email enviado' });
            } catch (emailError) {
                console.error(emailError);
                pool.query('UPDATE usuarios SET resetPasswordToken = NULL, resetPasswordExpire = NULL WHERE id = ?', [user.id]);
                return next(new ErrorResponse('Não foi possível enviar o email', 500));
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
            return next(new ErrorResponse('Token inválido ou expirado', 400));
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
