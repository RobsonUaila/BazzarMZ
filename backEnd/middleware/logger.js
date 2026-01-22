const pino = require('pino');
const pinoHttp = require('pino-http');

// Configuração inteligente do logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  // Em produção, usa formato JSON padrão (melhor para monitoramento)
  // Em desenvolvimento, usa pino-pretty para leitura fácil
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  } : undefined
});

const loggerMiddleware = pinoHttp({ logger });

module.exports = { loggerMiddleware, logger };