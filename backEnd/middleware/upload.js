const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination:  (req, file, cb) => {
        if(file.mimetype.startsWith('image')){
            cb(null, 'uploads/capas');
        } else if  (file.mimetype.startsWith('videos/')){
            cb(null, 'uploads/videos');
        } else if((file.mimetype.startsWith('image/gif'))){
            cb(null, 'uploads/gifs');
        } else{
            cb(new Error('Tipo de arquivo nao suportado'));
        }

        },

        filename: (req, file, cb) => {
            const nomeUnico = Date.now() + path.extname(file.originalname);
            cb(null, nomeUnico);
        }
    });


    const fileFilter = (req, file, cb) => {
        const permitidos = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
    if(permitidos.includes(file.mimetype)){
        cb(null, true);
    } else {
        cb(null, false);
    
    }
    
    };

    module.exports = multer({storage, fileFilter});