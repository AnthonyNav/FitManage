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

    registrarUsuario(datos, callback){

        // Query SQL corregido
        const query = `
            INSERT INTO users (
                email, password, type_user, active
            )
            VALUES (?, ?, ?, ?)
        `;
    
        const values = [
            datos.email,
            datos.password,
            datos.type_user,
            datos.active
        ];
    
        // Ejecución de la consulta
        db.query(query, values, (err, result) => {
            if (err) {
                console.error("Error al guardar el usuario:", err);
                return callback(err, null); 
            }
            console.log("Usuario guardado correctamente");
            callback(null, result); 
        });
    }
}


export default new users();