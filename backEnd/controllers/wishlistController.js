const db = require('../db');

// Obter wishlist do usuário
exports.getUserWishlist = (req, res) => {
  const usuario_id = req.user?.id;

  if (!usuario_id) {
    return res.status(401).json({ message: 'Você precisa estar logado' });
  }

  const sql = `
    SELECT p.* FROM wishlist w
    JOIN produtos p ON w.produto_id = p.id
    WHERE w.usuario_id = ?
    ORDER BY w.data_criacao DESC
  `;

  db.query(sql, [usuario_id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar wishlist:', err);
      return res.status(500).json({ message: 'Erro ao buscar wishlist' });
    }
    res.json(results || []);
  });
};

// Adicionar à wishlist
exports.addToWishlist = (req, res) => {
  const { produtoId } = req.params;
  const usuario_id = req.user?.id;

  if (!usuario_id) {
    return res.status(401).json({ message: 'Você precisa estar logado' });
  }

  const sql = 'INSERT IGNORE INTO wishlist (usuario_id, produto_id) VALUES (?, ?)';
  db.query(sql, [usuario_id, produtoId], (err, results) => {
    if (err) {
      console.error('Erro ao adicionar à wishlist:', err);
      return res.status(500).json({ message: 'Erro ao adicionar' });
    }
    res.status(201).json({ message: 'Adicionado à wishlist' });
  });
};

// Remover da wishlist
exports.removeFromWishlist = (req, res) => {
  const { produtoId } = req.params;
  const usuario_id = req.user?.id;

  if (!usuario_id) {
    return res.status(401).json({ message: 'Você precisa estar logado' });
  }

  const sql = 'DELETE FROM wishlist WHERE usuario_id = ? AND produto_id = ?';
  db.query(sql, [usuario_id, produtoId], (err, results) => {
    if (err) {
      console.error('Erro ao remover da wishlist:', err);
      return res.status(500).json({ message: 'Erro ao remover' });
    }
    res.json({ message: 'Removido da wishlist' });
  });
};

// Sincronizar wishlist local com backend
exports.syncWishlist = (req, res) => {
  const usuario_id = req.user?.id;
  const { productIds } = req.body;

  if (!usuario_id) {
    return res.status(401).json({ message: 'Você precisa estar logado' });
  }

  // Limpar wishlist atual e adicionar novos items
  const deleteSql = 'DELETE FROM wishlist WHERE usuario_id = ?';
  db.query(deleteSql, [usuario_id], (err) => {
    if (err) {
      console.error('Erro ao limpar wishlist:', err);
      return res.status(500).json({ message: 'Erro ao sincronizar' });
    }

    if (!productIds || productIds.length === 0) {
      return res.json({ message: 'Wishlist sincronizada' });
    }

    const insertSql = 'INSERT INTO wishlist (usuario_id, produto_id) VALUES ?';
    const values = productIds.map(id => [usuario_id, id]);

    db.query(insertSql, [values], (err) => {
      if (err) {
        console.error('Erro ao adicionar items:', err);
        return res.status(500).json({ message: 'Erro ao sincronizar' });
      }
      res.json({ message: 'Wishlist sincronizada com sucesso' });
    });
  });
};
