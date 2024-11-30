import db from '../database/conexion.js';

class Profesor_Disciplinas{
    constructor(){

    }

    guardarDisciplinaDeProfesor(datos, callback) {
        const { id_profesor, id_disciplina } = datos;
    
        const query = `
            INSERT INTO profesor_disciplinas (id_profesor, id_disciplina)
            VALUES (?, ?)
        `;
    
        const values = [id_profesor, id_disciplina];
    
        db.query(query, values, (err, result) => {
            if (err) {
                console.error("Error al guardar la disciplina del profesor:", err);
                return callback(err, null);
            }
            callback(null, result);
        });
    }
    // guardarDisciplinaDeProfesor(datos, callback) {
    //     const { id_profesor , id_disciplina } = datos;

    //     // Query SQL corregido
    //     const query = `
    //         INSERT INTO profesor_disciplinas (
    //             id_profesor, id_disciplina
    //         )
    //         VALUES (?, ?)
    //     `;
    
    //     const values = [
    //         id_profesor , id_disciplina
    //     ];
    
    //     // Ejecución de la consulta
    //     db.query(query, values, (err, result) => {
    //         if (err) {
    //             console.error("Error al guardar la disciplina del profesor:", err);
    //             return callback(err, null); 
    //         }
    //         console.log("Disciplina del profesor guardada correctamente");
    //         callback(null, result); 
    //     });
    // }

}

export default new Profesor_Disciplinas();