
import db from '../database/conexion.js';

class PaquetesAdquiridos{
    constructor(){}

    registrarPaqueteAdquirido(datos, callback) {
        const { id_alumno, id_paquete, fecha_inicio, fecha_fin, reservas_disponibles } = datos;
        const query = `
            INSERT INTO paquetes_adquiridos (id_paquete, id_alumno, fecha_inicio, fecha_fin, reservas_disponibles)
            VALUES (?, ?, ?, ?, ?)
        `;

        const values = [id_paquete, id_alumno, fecha_inicio, fecha_fin, reservas_disponibles];
        
        db.query(query, values, (err, result) => {
            if (err){
                console.error("Error al registrar los paquetes adquiridos del alumno:", err);
                return callback(err, null);
            }
            console.log('Paquete adquirido registrado correctamente');
            callback(null, result);
        });
    }

    // getPaquetesByAlumno(id_alumno, fecha, callback) {
    //     const query = `
    //         SELECT *
    //         FROM alumnos
    //         INNER JOIN paquetes_adquiridos
    //         ON alumnos.id_alumno = paquetes_adquiridos.id_alumno
    //         WHERE alumnos.id_alumno = ?
    //     `;
    
    //     db.query(query, [id_alumno], (err, results) => {
    //         if (err) {
    //             console.error("Error al obtener los paquetes adquiridos del alumno:", err);
    //             return callback(err, null);
    //         }
    //         if (results.length === 0) {
    //             return callback(null, []);  // No hay paquetes adquiridos
    //         }
    //         callback(null, results);
    //     });
    // }

    getPaquetesVigentesByAlumno(id_alumno, callback) {
        const fecha = new Date().toISOString().split('T')[0];
        const query = `
            SELECT *
            FROM alumnos
            INNER JOIN paquetes_adquiridos
            ON alumnos.id_alumno = paquetes_adquiridos.id_alumno
            WHERE alumnos.id_alumno = ?
            AND paquetes_adquiridos.fecha_fin >= ?
            AND paquetes_adquiridos.reservas_disponibles > 0
        `;
    
        db.query(query, [id_alumno, fecha], (err, results) => {
            if (err) {
                console.error("Error al obtener los paquetes vigentes del alumno:", err);
                return callback(err, null);
            }
            callback(null, results);
        });
    }
}


export default new PaquetesAdquiridos();