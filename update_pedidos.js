const fs = require('fs');
let content = fs.readFileSync('backEnd/routes/pedidos.js', 'utf8');

const routeToAdd = `
// Rota para Parceiro ver suas proprias vendas
router.get('/partner-sales', auth, authorize('partner'), (req, res, next) => {
    const partnerId = req.user.id;
    const sql = \`
        SELECT 
            p.idPedidos as id, p.data as data_pedido, p.status,
            u.nome as nome_cliente,
            SUM(ip.quantidade * ip.preco_unitario) as total,
            JSON_ARRAYAGG(JSON_OBJECT('name', prod.nome, 'quantity', ip.quantidade, 'price', ip.preco_unitario)) as items
        FROM pedidos p
        JOIN itens_pedidos ip ON p.idPedidos = ip.pedidos_id
        JOIN produtos prod ON ip.produto_id = prod.id
        JOIN usuarios u ON p.idusuarios = u.idusuarios
        WHERE prod.vendedor_id = ?
        GROUP BY p.idPedidos, p.data, p.status, u.nome
        ORDER BY p.data DESC
    \`;
    pool.query(sql, [partnerId], (err, vendas) => {
        if (err) {
            console.error('Erro DB (GET /partner-sales):', err);
            return next(new ErrorResponse('Erro ao buscar vendas do parceiro', 500));
        }
        res.json({ success: true, data: vendas });
    });
});
`;

if (!content.includes('/partner-sales')) {
    content = content.replace('module.exports = router;', routeToAdd + '\nmodule.exports = router;');
    fs.writeFileSync('backEnd/routes/pedidos.js', content);
    console.log('Route added successfully!');
} else {
    console.log('Route already exists!');
}
