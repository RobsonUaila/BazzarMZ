const ErrorResponse = require('../utils/ErrorResponse');
const { logger } = require('./logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log para o console/arquivo usando o logger já configurado
  logger.error({ err }, err.message);

  // Exemplo: Erro de entrada duplicada no MySQL
  if (err.code === 'ER_DUP_ENTRY') {
    const message = 'Registro duplicado encontrado. Verifique os campos únicos.';
    error = new ErrorResponse(message, 400);
  }

  // Resposta padrão
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Erro Interno do Servidor'
  });
};

module.exports = errorHandler;