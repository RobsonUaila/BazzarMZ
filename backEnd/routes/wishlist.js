const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const auth = require('../middleware/auth');

// Obter wishlist do usuário (requer auth)
router.get('/', auth.verificarToken, wishlistController.getUserWishlist);

// Adicionar à wishlist
router.post('/produto/:produtoId', auth.verificarToken, wishlistController.addToWishlist);

// Remover da wishlist
router.delete('/produto/:produtoId', auth.verificarToken, wishlistController.removeFromWishlist);

// Sincronizar wishlist local com backend
router.post('/sync', auth.verificarToken, wishlistController.syncWishlist);

module.exports = router;
