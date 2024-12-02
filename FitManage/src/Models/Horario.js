import db from '../database/conexion.js';

class Horario{

    constructor(){}

    guardarHorario(datos, callback) {
        const {
            id_disciplina,
            id_profesor,
            dia,
            hora,
            cupo
        } = datos;
    
        const query = `
            INSERT INTO horario (
                id_disciplina, id_profesor, dia, hora, cupo
            )
            VALUES (?, ?, ?, ?, ?)
        `;
    
        const values = [
            id_disciplina,
            id_profesor,
            dia,
            hora,
            cupo
        ];
    
        db.query(query, values, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        });
    }
    
    verificarDuplicidadHorario(datos, callback) {
        const { id_disciplina, id_profesor, dia, hora } = datos;

        const query = `
            SELECT * FROM horario
            WHERE id_disciplina = ? AND id_profesor = ? AND dia = ? AND hora = ?
        `;

        const values = [id_disciplina, id_profesor, dia, hora];

        db.query(query, values, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            // Si `result` tiene filas, significa que existe un horario con los mismos datos
            const existe = result.length > 0;
            callback(null, existe);
        });
    }

}

export default new Horario();


