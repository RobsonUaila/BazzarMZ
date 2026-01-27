const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuarioSchema = require('../validators/usuarioValidator');

const jwtSecret = process.env.JWT_SECRET;
console.log('JWT_SECRET no controlador:', jwtSecret ? 'Definido (tamanho: ' + jwtSecret.length + ')' : 'Não Definido');

exports.getAllUsuarios = (req, res) => {
    const sql = 'SELECT idusuarios, nome, email, role FROM usuarios';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            return res.status(500).json({ message: 'Erro interno no servidor' });
        }
        res.json(results);
    });
};

exports.createUsuario = async (req, res) => {
    const { error } = usuarioSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { nome, email, senha, role } = req.body;

    try {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
        const senhaHash = await bcrypt.hash(senha, saltRounds);

        const sql = 'INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)';
        db.query(sql, [nome, email, senhaHash, role], (err, results) => {
            if (err) {
                console.error('Erro ao criar usuário:', err);
                return res.status(500).json({ message: 'Erro ao criar usuário' });
            }
            res.status(201).json({ message: 'usuario criado com sucesso', id: results.insertId });
        });
    } catch (error) {
        res.status(500).json({ erro: 'erro ao criptografar a senha' });
    }
};

exports.loginUsuario = (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    const sql = 'SELECT * FROM usuarios WHERE email = ?';

    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error('Erro no login (SQL):', err);
            return res.status(500).json({ message: 'Erro interno no servidor' });
        }
        if (results.length === 0) return res.status(401).json({ message: 'usuario nao encontrado' });

        const usuario = results[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) return res.status(401).json({ message: 'senha invalida' });

        const refreshToken = jwt.sign(
            { id: usuario.idusuarios },
            jwtSecret,
            { expiresIn: '7d' }
        );

        const token = jwt.sign(
            {
                id: usuario.idusuarios,
                email: usuario.email,
                role: usuario.role
            },
            jwtSecret,
            { expiresIn: '1h' }
        );

        res.json({ 
            message: 'Login realizado com sucesso!', 
            token, 
            refreshToken,
            user: {
                id: usuario.idusuarios,
                nome: usuario.nome,
                email: usuario.email,
                role: usuario.role
            }
        });
    });
};

exports.refreshToken = (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token é necessário' });

    jwt.verify(refreshToken, jwtSecret, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'refresh token invalido' });

        const novoToken = jwt.sign({ id: decoded.id }, jwtSecret, { expiresIn: '1h' });

        res.json({ token: novoToken });
    });
};