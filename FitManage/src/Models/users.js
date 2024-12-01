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

    buscarIdPorEmail(email, callback) {
        // Consulta para obtener el id_user asociado al email
        const query = `SELECT id_user FROM users WHERE email = ?`;
    
        db.query(query, [email], (err, rows) => {
            if (err) {
                console.error("Error al buscar el id_user por email:", err);
                return callback(err, null); // Devuelve el error al controlador
            }
    
            // Si no hay resultados, devuelve un error personalizado
            if (rows.length === 0) {
                return callback(new Error("No se encontró un usuario con el email proporcionado."), null);
            }
    
            // Devuelve el id_user al controlador
            callback(null, rows[0].id_user);
        });
    }

    actualizarDatosPorId(id_user, datosActualizar, callback) {
        // Construir los campos dinámicamente a partir de los datos a actualizar
        const campos = Object.keys(datosActualizar).map(
            (campo) => `${campo} = ?`
        );
        const valores = Object.values(datosActualizar);
        valores.push(id_user); // Agregar el id_user al final para la consulta

        // Query de actualización
        const query = `UPDATE users SET ${campos.join(", ")} WHERE id_user = ?`;

        db.query(query, valores, (err, result) => {
            if (err) {
                console.error("Error al actualizar los datos del usuario:", err);
                return callback(err, null); // Retorna el error si ocurre
            }
            console.log("Datos del usuario actualizados correctamente");
            callback(null, result); // Retorna el resultado de la consulta
        });
    }

    obtenerPasswordPorId(id_user, callback) {
        const query = `SELECT password FROM users WHERE id_user = ?`;

        db.query(query, [id_user], (err, rows) => {
            if (err) {
                console.error("Error al obtener el password:", err);
                return callback(err, null);
            }

            if (rows.length === 0) {
                return callback(
                    new Error("No se encontró un usuario con el ID proporcionado."),
                    null
                );
            }

            // Devuelve solo el campo `password`
            callback(null, rows[0].password);
        });
    }
}


export default new users();