const joi = require('joi');

module.exports = joi.object({
nome: joi.string().min(3).required(),
email: joi.string().email().required(),
senha: joi.string().min(6).required(),
role: joi.string().valid('admin','user').required()

})