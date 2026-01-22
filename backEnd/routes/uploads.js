const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// Middleware para validar que o arquivo foi enviado
const validateFile = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({
            erro: 'Dados inválidos',
            detalhes: ['Arquivo não enviado']
        });
    }
    next();
};

router.post('/capa', auth, upload.single('arquivo'), validateFile, (req, res) => {
    res.json({
        message: 'Arquivo enviado com sucesso',
        filename: req.file.filename
    })
});

router.post('/media', auth, upload.single('arquivo'), validateFile, (req, res) => {
    res.json({
        message: 'Arquivo enviado com sucesso',
        filename: req.file.filename
    })
});

module.exports = router;