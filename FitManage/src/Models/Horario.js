import db from '../database/conexion.js';

class Horario {

    constructor() { }

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

    obtenerHorarios(callback) {
        const query = `
        SELECT 
            d.nombre AS disciplina,
            p.nombre AS profesor,
            h.dia,
            h.hora,
            h.cupo,
            h.nrc  
        FROM horario h
        INNER JOIN disciplinas d ON h.id_disciplina = d.id_disciplina
        INNER JOIN profesor p ON h.id_profesor = p.id_profesor
    `;

        db.query(query, (err, results) => {
            if (err) {
                return callback(err, null);
            }

            // Truncar los segundos de la hora
            const horarios = results.map(row => ({
                disciplina: row.disciplina,
                profesor: row.profesor,
                dia: row.dia,
                hora: row.hora.slice(0, 5), // Solo hh:mm
                cupo: row.cupo,
                nrc: row.nrc // Agregamos el NRC aquí
            }));

            callback(null, horarios);
        });
    }
    

    actualizarCupoPorNrc(nrc, callback) {
        // Consulta para obtener el cupo actual
        const querySelect = `
            SELECT cupo 
            FROM horario 
            WHERE nrc = ?
        `;
    
        db.query(querySelect, [nrc], (err, results) => {
            if (err) {
                return callback(err, null);
            }
    
            // Verificar si se encontró el registro
            if (results.length === 0) {
                return callback(null, { actualizado: false, mensaje: 'Horario no encontrado mat' }); // No se encontró un horario con ese NRC
            }
    
            const cupoActual = results[0].cupo;
    
            // Verificar si el cupo ya es 0
            if (cupoActual <= 0) {
                return callback(null, { actualizado: false, mensaje: 'El cupo ya está en 0' });
            }
    
            const nuevoCupo = cupoActual - 1;
    
            // Actualizar el cupo en la base de datos
            const queryUpdate = `
                UPDATE horario 
                SET cupo = ? 
                WHERE nrc = ?
            `;
    
            db.query(queryUpdate, [nuevoCupo, nrc], (err, result) => {
                if (err) {
                    return callback(err, null);
                }
    
                // Verificar si se afectó algún registro
                const filasAfectadas = result.affectedRows > 0;
                const mensaje = filasAfectadas
                    ? `Cupo actualizado a ${nuevoCupo}`
                    : 'No se pudo actualizar el cupo';
                callback(null, { actualizado: filasAfectadas, mensaje });
            });
        });
    }
    
    
    

}

export default new Horario();


