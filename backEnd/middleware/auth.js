const jwt = require ('jsonwebtoken');
const JwtSecret = process.env.JWT_SECRET;

module.exports = (req, res, next) =>{
    const authHeader = req.headers['authorization'];

    if (!authHeader){
        return res.status(401).json({message:'token nao fornecido'});
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JwtSecret, (err, decoded)=>{
        if(err || !decoded){
            return res.status(401).json({message:'Token invalido'});
        }
        
        req.usuario = decoded;
        next();
    });
};
