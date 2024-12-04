import db from '../database/conexion.js';

class Profesor{

    constructor(){}
    
    getProfesor(email, callback) { // Para verificar si ya existe el usuario
        db.query(
            `SELECT * FROM profesor WHERE email = ?`,
            [email],
            (err, rows) => {
                if (err) {
                    return callback(err, null); // Retorna error al callback si ocurre
                }
                // Retorna true si encontró coincidencias, false en caso contrario
                callback(null, rows);
            }
        );
    }

    guardarProfesor(datos, callback) {
        const { nombre, edad, telefono, email } = datos;

        // Query SQL corregido
        const query = `
            INSERT INTO profesor (
                nombre, edad, telefono, email
            )
            VALUES (?, ?, ?, ?)
        `;
    
        const values = [
            nombre,   // Nombre
            edad,     // Edad
            telefono, // Teléfono
            email     // Email
        ];
    
        // Ejecución de la consulta
        db.query(query, values, (err, result) => {
            if (err) {
                console.error("Error al guardar el profesor:", err);
                return callback(err, null); 
            }
            console.log("Profesor guardado correctamente");
            callback(null, result); 
        });
    }

    getProfesorIdPorEmail(email, callback) {
        const query = `
            SELECT id_profesor 
            FROM profesor 
            WHERE email = ?
        `;
    
        db.query(query, [email], (err, rows) => {
            if (err) {
                return callback(err, null); // Retorna el error si ocurre
            }
    
            // Verifica si encontró un registro y retorna el id_profesor
            if (rows.length > 0) {
                const idProfesor = rows[0].id_profesor;
                callback(null, idProfesor); // Retorna el ID del profesor
            } else {
                callback(null, null); // Retorna null si no encuentra resultados
            }
        });
    }
    

}

export default new Profesor();



