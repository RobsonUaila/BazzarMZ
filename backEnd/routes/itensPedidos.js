const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validator');
const { criaritenspedidosSchema } = require('../validators/itensPedidosValidator');
const itensPedidosController = require('../controllers/itensPedidosController');

router.get('/', auth, itensPedidosController.getAllItens);
router.get('/:id', auth, itensPedidosController.getItemById);
router.post('/', auth, validate(criaritenspedidosSchema), itensPedidosController.createItem);
router.put('/:id', auth, itensPedidosController.updateItem);
router.delete('/:id', auth, itensPedidosController.deleteItem);

module.exports = router;