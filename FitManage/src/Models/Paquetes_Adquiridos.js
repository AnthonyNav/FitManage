
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
            //console.log(results);
            callback(null, results);
        });
    }

    getReservasDisponiblesYFechaFin(id_alumno, callback) {
        const query = `
            SELECT reservas_disponibles, fecha_fin
            FROM paquetes_adquiridos
            WHERE id_alumno = ?
        `;
    
        db.query(query, [id_alumno], (err, results) => {
            if (err) {
                console.error("Error al obtener reservas y fecha de fin:", err);
                return callback(err, null);
            }
    
            // Verificar si se encontraron resultados
            if (results.length === 0) {
                return callback(null, []); // No hay paquetes para este alumno
            }
    
            // Devolver los resultados
            callback(null, results);
        });
    }
    

    decrementarReservas(id_alumno, callback) {
        // Paso 1: Buscar las reservas disponibles para el alumno
        const querySelect = `
            SELECT reservas_disponibles 
            FROM paquetes_adquiridos
            WHERE id_alumno = ? AND reservas_disponibles > 0
            ORDER BY fecha_fin ASC
            LIMIT 1
        `;
    
        db.query(querySelect, [id_alumno], (err, results) => {
            if (err) {
                console.error("Error al obtener las reservas disponibles:", err);
                return callback(err, null);
            }
    
            if (results.length === 0) {
                return callback(null, { message: "No hay reservas disponibles para este alumno" });
            }
    
            // Extraemos el valor actual de reservas_disponibles
            const reservasDisponibles = results[0].reservas_disponibles;
    
            // Paso 2: Decrementar el valor
            const nuevasReservas = reservasDisponibles - 1;
    
            // Paso 3: Actualizar la tabla
            const queryUpdate = `
                UPDATE paquetes_adquiridos
                SET reservas_disponibles = ?
                WHERE id_alumno = ? AND reservas_disponibles = ?
                LIMIT 1
            `;
    
            db.query(queryUpdate, [nuevasReservas, id_alumno, reservasDisponibles], (err, result) => {
                if (err) {
                    console.error("Error al actualizar las reservas disponibles:", err);
                    return callback(err, null);
                }
    
                // Confirmación de éxito
                console.log("Reservas disponibles actualizadas correctamente.");
                callback(null, { message: "Reservas decrementadas exitosamente", nuevasReservas });
            });
        });
    }
    
}


export default new PaquetesAdquiridos();