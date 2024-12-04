import db from "../database/conexion.js"; // Importa tu conexión a la base de datos

class ReservaClase {
    // Trae a los cumpleañeros que tienen reserva hoy
    getAlumnosCumple(callback) {
        const query = "SELECT  CONCAT(alumnos.nombre, ' ', alumnos.apellidos) AS nombre_alumno, profesor.nombre AS nombre_profesor, alumnos.email AS email_alumno, profesor.email AS email_profesor, alumnos.telefono AS telefono_alumno, profesor.telefono AS telefono_profesor, disciplinas.nombre AS disciplina, CONCAT(horario.dia, ': ', horario.hora) AS horario_clase FROM reserva_clase INNER JOIN alumnos ON alumnos.id_alumno = reserva_clase.id_alumno INNER JOIN horario ON horario.nrc = reserva_clase.nrc INNER JOIN disciplinas ON disciplinas.id_disciplina = horario.id_disciplina INNER JOIN profesor ON  horario.id_profesor = profesor.id_profesor WHERE (MONTH(reserva_clase.fecha_clase) = MONTH(alumnos.fecha_nacimiento)) AND (DAY(reserva_clase.fecha_clase) = DAY(alumnos.fecha_nacimiento)) AND (MONTH(reserva_clase.fecha_clase) = MONTH(CURRENT_DATE()))AND (DAY(reserva_clase.fecha_clase) = DAY(CURRENT_DATE())-1);";
        db.query(query, (err, rows) => {
            if (err) {
                console.error("Error al obtener los alumnos:", err);
                return callback(err, null);
            }
            return callback(null, rows);
        });
    };

    guardarReserva({ id_alumno, nrc, fecha_clase }, callback) {
        const query = `
            INSERT INTO reserva_clase (id_alumno, nrc, fecha_clase)
            VALUES (?, ?, ?)
        `;

        db.query(query, [id_alumno, nrc, fecha_clase], (err, result) => {
            if (err) {
                console.error('Error al guardar la reserva:', err);
                return callback(err, null); // Retorna el error a través del callback
            }
            console.log('Reserva guardada exitosamente:', result);
            callback(null, result); // Retorna el resultado de la inserción
        });
    }

    verificarReserva({ id_alumno, nrc, fecha_clase }, callback) {
        const query = `
            SELECT COUNT(*) AS count 
            FROM reserva_clase 
            WHERE id_alumno = ? 
            AND nrc = ? 
            AND fecha_clase = ?
        `;

        db.query(query, [id_alumno, nrc, fecha_clase], (err, result) => {
            if (err) {
                console.error('Error al verificar la reserva:', err);
                return callback(err, null); // Retorna el error a través del callback
            }
            console.log(result);
            // Si el count es mayor que 0, significa que ya existe una reserva con esos 3 campos
            const existeReserva = result[0].count > 0;
            console.log(`¿Existe reserva para el alumno con id ${id_alumno}, NRC ${nrc} y fecha ${fecha_clase}? ${existeReserva}`);
            
            callback(null, existeReserva); // Retorna si la reserva ya existe (true o false)
        });
    }
}

export default new ReservaClase();