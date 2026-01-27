const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');
const { auth } = require('../middleware/auth');

// Obter reviews de um produto
router.get('/produto/:productId/reviews', reviewsController.getProductReviews);

// Criar review (requer autenticação)
router.post('/produto/:productId/reviews', auth.verificarToken, reviewsController.createReview);

// Marcar review como útil
router.patch('/reviews/:reviewId/helpful', reviewsController.markReviewHelpful);

// Deletar review (apenas do próprio usuário)
router.delete('/reviews/:reviewId', auth.verificarToken, reviewsController.deleteReview);

module.exports = router;
