module.exports = (rolePermitido) =>{
    return (req, res, next) =>{
        if (req.usuario.role !== rolePermitido) {
            return res.status(403).json({message:'Acesso negado!'})
        }
    next();
    };
};