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
}

export default new ReservaClase();