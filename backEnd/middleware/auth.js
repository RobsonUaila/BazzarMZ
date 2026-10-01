const jwt = require ('jsonwebtoken');
const JwtSecret = process.env.JWT_SECRET;

const auth = (req, res, next) =>{
    const authHeader = req.headers['authorization'];

    if (!authHeader){
        return res.status(401).json({message:'token nao fornecido'});
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JwtSecret, (err, decoded)=>{
        if(err){
            return res.status(401).json({ message: 'Token inválido ou expirado', error: err.message });
        }
        
        if(!decoded){
            return res.status(401).json({message:'Token inválido'});
        }
        
        req.usuario = decoded;
        req.user = decoded;
        next();
    });
};


// Middleware opcional: se houver token, valida; se não houver, segue como convidado
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return next();

    const token = authHeader.split(' ')[1];
    if (!token) return next();

    jwt.verify(token, JwtSecret, (err, decoded)=> {
        if (err || !decoded) {
            return res.status(401).json({ message: 'Token inválido ou expirado' });
        }
        req.usuario = decoded;
        req.user = decoded;
        next();
    });
};
// Middleware para verificar role/autorização
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ message: 'Não autenticado' });
        }
        
        if (!roles.includes(req.usuario.role)) {
            return res.status(403).json({ message: `Acesso negado. Requer role: ${roles.join(", ")}` });
        }
        
        next();
    };
};

module.exports = { auth, optionalAuth, authorize };

