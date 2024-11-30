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

}

export default new Profesor();



