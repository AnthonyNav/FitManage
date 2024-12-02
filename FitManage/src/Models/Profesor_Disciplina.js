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

    obtenerProfesoresPorDisciplina(id_disciplina) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT p.id_profesor, p.nombre 
                FROM profesor_disciplinas pd
                INNER JOIN profesor p ON pd.id_profesor = p.id_profesor
                WHERE pd.id_disciplina = ?
            `;

            db.query(query, [id_disciplina], (err, rows) => {
                if (err) {
                    console.error("Error al obtener profesores por disciplina:", err);
                    return reject(err);
                }
                resolve(rows); // Retornamos los profesores encontrados
            });
        });
    }

}

export default new Profesor_Disciplinas();