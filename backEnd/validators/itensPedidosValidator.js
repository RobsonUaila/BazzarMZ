const Joi = require('joi');

const criaritenspedidosSchema = Joi.object({
    idPedidos: Joi.number().integer().positive().required(),
    idProduto: Joi.number().integer().positive().required(),
    quantidade: Joi.number().integer().min(1).positive().required(),
    preco_unitario: Joi.number().positive().required(),
});

module.exports = {
    criaritenspedidosSchema
};
