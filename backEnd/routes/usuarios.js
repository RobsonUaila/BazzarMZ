const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const db = require('../db');
const auth = require('../middleware/auth');

// Rotas de Usuários
router.get('/', usuariosController.getAllUsuarios);
router.post('/', usuariosController.createUsuario);
router.post('/login', usuariosController.loginUsuario);
router.post('/refresh', usuariosController.refreshToken);

// GET /:id - Detalhes do usuário (Protegido)
router.get('/:id', auth, (req, res) => {
    // Verifica permissão: Admin ou o próprio dono da conta
    // Nota: req.usuario.id vem do token JWT (middleware auth)
    if (req.usuario.role !== 'admin' && parseInt(req.params.id) !== req.usuario.id) {
        return res.status(403).json({ message: 'Acesso negado' });
    }

    // Selecionamos apenas dados seguros (excluindo a senha)
    const sql = 'SELECT idusuarios AS id, nome, email, role FROM usuarios WHERE idusuarios = ?';
    
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'Usuário não encontrado' });
        
        res.json(results[0]);
    });
});

// PUT /:id - Atualizar usuário (Protegido)
router.put('/:id', auth, (req, res) => {
    if (req.usuario.role !== 'admin' && parseInt(req.params.id) !== req.usuario.id) {
        return res.status(403).json({ message: 'Acesso negado' });
    }
    const { nome, email } = req.body;
    const sql = 'UPDATE usuarios SET nome = ?, email = ? WHERE idusuarios = ?';
    db.query(sql, [nome, email, req.params.id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Usuário não encontrado' });
        res.json({ message: 'Usuário atualizado com sucesso' });
    });
});

// DELETE /:id - Deletar usuário (Protegido)
router.delete('/:id', auth, (req, res) => {
    if (req.usuario.role !== 'admin' && parseInt(req.params.id) !== req.usuario.id) {
        return res.status(403).json({ message: 'Acesso negado' });
    }
    const sql = 'DELETE FROM usuarios WHERE idusuarios = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Usuário não encontrado' });
        res.json({ message: 'Usuário removido com sucesso' });
    });
});

module.exports = router;