const Joi = require('joi');

const criarPedidoSchema = Joi.object({
    status: Joi.string()
    .valid('pendente', 'processando', 'enviado', 'entregue', 'cancelado')
    .required(),
    total: Joi.number().positive().required()
}).required()

module.exports = {criarPedidoSchema};