import db from '../database/conexion.js';

class users{

    constructor(){

    }

    buscarEmail(email, callback) {
        
        // Consulta para buscar el registro
        db.query(
            `SELECT * FROM users WHERE email = ? AND email LIKE '%@gmail.com'`,
            [email],
            (err, rows) => {
                if (err) {
                    return callback(err, null);
                }

                // Devuelve los resultados al controlador
                callback(null, rows);
            }
        );

    }
}


export default new users();