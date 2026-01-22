const db = require('../db');

// Obter reviews de um produto
exports.getProductReviews = (req, res) => {
  const { productId } = req.params;

  const sql = `
    SELECT r.id, r.produto_id, r.usuario_id, r.rating, 
           r.comentario, r.helpful, r.data_criacao,
           u.nome as usuario_nome
    FROM reviews r
    LEFT JOIN usuarios u ON r.usuario_id = u.idusuarios
    WHERE r.produto_id = ?
    ORDER BY r.data_criacao DESC
  `;

  db.query(sql, [productId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar reviews:', err);
      return res.status(500).json({ message: 'Erro ao buscar reviews' });
    }
    res.json(results || []);
  });
};

// Criar novo review
exports.createReview = (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  const usuario_id = req.user?.id;

  if (!usuario_id) {
    return res.status(401).json({ message: 'Você precisa estar logado' });
  }

  if (!rating || !comment) {
    return res.status(400).json({ message: 'Rating e comentário são obrigatórios' });
  }

  const sql = `
    INSERT INTO reviews (produto_id, usuario_id, rating, comentario)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [productId, usuario_id, rating, comment], (err, results) => {
    if (err) {
      console.error('Erro ao criar review:', err);
      return res.status(500).json({ message: 'Erro ao criar review' });
    }
    res.status(201).json({ message: 'Review criado com sucesso', id: results.insertId });
  });
};

// Marcar review como útil
exports.markReviewHelpful = (req, res) => {
  const { reviewId } = req.params;

  const sql = 'UPDATE reviews SET helpful = helpful + 1 WHERE id = ?';
  db.query(sql, [reviewId], (err, results) => {
    if (err) {
      console.error('Erro ao marcar como útil:', err);
      return res.status(500).json({ message: 'Erro ao atualizar' });
    }
    res.json({ message: 'Review marcado como útil' });
  });
};

// Deletar review (apenas do próprio usuário)
exports.deleteReview = (req, res) => {
  const { reviewId } = req.params;
  const usuario_id = req.user?.id;

  const sql = 'DELETE FROM reviews WHERE id = ? AND usuario_id = ?';
  db.query(sql, [reviewId, usuario_id], (err, results) => {
    if (err) {
      console.error('Erro ao deletar review:', err);
      return res.status(500).json({ message: 'Erro ao deletar' });
    }
    if (results.affectedRows === 0) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    res.json({ message: 'Review deletado com sucesso' });
  });
};
