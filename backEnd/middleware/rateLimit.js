const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per windowMs
    message: 'Muitas requisições deste IP, por favor tente novamente depois.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for health check
        return req.path === '/health' || req.path === '/api/health';
    }
});

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per windowMs
    message: 'Muitas tentativas de login, por favor tente novamente após 15 minutos.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful requests
    skipFailedRequests: false // Count failed requests
});

// Very strict rate limiter for password reset
const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts per hour
    message: 'Muitas tentativas de reset de senha, por favor tente novamente após 1 hora.',
    standardHeaders: true,
    legacyHeaders: false
});

// Moderate rate limiter for creating resources
const createLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
    message: 'Muitas requisições, por favor aguarde um momento.',
    standardHeaders: true,
    legacyHeaders: false
});

// Download/upload limiter
const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 uploads per hour
    message: 'Limite de uploads excedido, por favor tente novamente mais tarde.',
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    apiLimiter,
    authLimiter,
    passwordResetLimiter,
    createLimiter,
    uploadLimiter
};
