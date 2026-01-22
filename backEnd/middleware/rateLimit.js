const rateLimit = require('express-rate-limit');

// Limiter geral para a API (Proteção básica contra DDoS)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limite de 100 requisições por IP por janela
    standardHeaders: true, // Retorna info de rate limit nos headers `RateLimit-*`
    legacyHeaders: false, // Desabilita headers `X-RateLimit-*`
    message: {
        status: 429,
        message: 'Muitas requisições deste IP, por favor tente novamente em 15 minutos.'
    }
});

// Limiter estrito para autenticação (Proteção contra Brute Force)
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 10, // Limite de 10 tentativas de login/registro por hora por IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        message: 'Muitas tentativas de acesso. Por segurança, tente novamente em 1 hora.'
    }
});

// Limiter para uploads (Proteção de armazenamento e banda)
const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 20, // Limite de 20 uploads por hora
    message: {
        status: 429,
        message: 'Limite de uploads excedido, tente novamente mais tarde.'
    }
});

module.exports = { apiLimiter, authLimiter, uploadLimiter };