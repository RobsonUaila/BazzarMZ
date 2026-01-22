const db = require('./db');

db.query('SELECT DATABASE() As base_actual', (err, results) =>{
    if (err) {
        console.error(err);
        return;
    }
    console.log('Base de dados actual!',  results[0].base_actual);
});