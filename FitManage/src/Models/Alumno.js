import db from '../database/conexion.js';

class Alumno {

    constructor() {

    }

    verificarNombreOEmail(nombre, email, callback) {
        db.query(
            `SELECT * FROM alumnos WHERE nombre = ? OR email = ?`,
            [nombre, email],
            (err, rows) => {
                if (err) {
                    return callback(err, null); // Retorna error al callback si ocurre
                }

                // Retorna true si encontró coincidencias, false en caso contrario
                callback(null, rows.length > 0);
            }
        );
    }

    //*Listo
    guardarAlumno(datos, callback) {
        const {
            id_user,
            nombre,
            apellidos,
            edad,
            domicilio,
            peso,
            estatura,
            telefono,
            aspiraciones,
            email,
            fecha_nacimiento,
            lugar_nacimiento,
            problemas_salud,
            certificado_medico,
            formato_firmado,
            type_alumno,
            fecha_ingreso, // Agregamos el nuevo campo
        } = datos;

        const query = `
            INSERT INTO alumnos (
                nombre, apellidos, edad, domicilio, peso, estatura,
                telefono, aspiraciones, email, fecha_nacimiento,
                lugar_nacimiento, problemas_salud, certificado_medico,
                formato_firmado, type_alumno, fecha_ingreso, id_user 
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
        `;

        const values = [
            nombre,
            apellidos,
            edad,
            domicilio,
            peso,
            estatura,
            telefono,
            aspiraciones,
            email,
            fecha_nacimiento,
            lugar_nacimiento,
            problemas_salud,
            certificado_medico,
            formato_firmado,
            type_alumno,
            fecha_ingreso,
            id_user,
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        });
    }

    //** listo para revisar */
    guardarEstudiante(datos, callback) {
        const {
            id_alumno,
            nivel_educativo,
            institucion,
        } = datos;

        const query = `
            INSERT INTO estudiante (
                id_alumno, nivel_educativo, institucion
            )
            VALUES (?, ?, ?)
        `;

        const values = [
            id_alumno,
            nivel_educativo,
            institucion,
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        });
    }



    obtenerIdPorEmail(email, callback) {
        const query = `SELECT id_alumno FROM alumnos WHERE email = ?`;

        db.query(query, [email], (err, rows) => {
            if (err) {
                return callback(err, null);
            }

            if (rows.length === 0) {
                return callback(null, null);
            }


            callback(null, rows[0].id_alumno);
        });
    }

    //??? Revisa el tipo de estatus
    obtenerNombresYEstatus(callback) {
        const query = `SELECT nombre, estatus FROM alumnos`;

        db.query(query, (err, rows) => {
            if (err) {
                return callback(err, null); // Retorna error al callback si ocurre
            }
            callback(null, rows); // Retorna los nombres y estatus
        });
    }


    //** prueba */
    obtenerInfoCompleta(nombre, callback) {
        const query = `
            SELECT 
                id_alumno, id_user, nombre, apellidos, edad, domicilio, telefono, email, 
                fecha_nacimiento, lugar_nacimiento, peso, estatura, 
                type_alumno, problemas_salud, aspiraciones, 
                formato_firmado, certificado_medico, estatus 
            FROM alumnos 
            WHERE nombre = ?;
        `;
        db.query(query, [nombre], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            if (results.length === 0) {
                return callback(null, null); // No se encontró el alumno
            }
            const alumno = results[0];
            callback(null, alumno);
        });
    }

    // Antony
    getAlumnos(callback) {
        const query = "SELECT * FROM alumnos";
        db.query(query, (err, rows) => {
            if (err) {
                console.error("Error al obtener los alumnos:", err);
                return callback(err, null);
            }
            callback(null, rows);
        });
    }


    //** prueba */
    obtenerInfoPorId(id_alumno, callback) {
        const query = `
            SELECT 
                id_alumno, nombre, apellidos, edad, domicilio, telefono, email, 
                fecha_nacimiento, lugar_nacimiento, peso, estatura, 
                type_alumno, problemas_salud, aspiraciones, 
                formato_firmado, certificado_medico, estatus 
            FROM alumnos 
            WHERE id_alumno = ?;
        `;
        db.query(query, [id_alumno], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            if (results.length === 0) {
                return callback(null, null); // No se encontró el alumno
            }
            callback(null, results[0]);
        });
    }

    // Actualizar campos específicos por ID
    actualizarAlumnoPorId(id_alumno, cambios, callback) {
        const campos = Object.keys(cambios).map((campo) => `${campo} = ?`);
        const valores = Object.values(cambios);
        valores.push(id_alumno);

        const query = `UPDATE alumnos SET ${campos.join(', ')} WHERE id_alumno = ?`;

        db.query(query, valores, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        });
    }

    // Verificar duplicados de nombre o email
    verificarDuplicados(nombre, email, id_alumno, callback) {
        const query = `
            SELECT * FROM alumnos 
            WHERE (nombre = ? OR email = ?) AND id_alumno != ?`;
        db.query(query, [nombre, email, id_alumno], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results.length > 0);
        });
    }


    //** Listo para revisar */
    obtenerDatosEstudiantePorId(id_alumno, callback) {
        const query = `
            SELECT 
                id_alumno, nivel_educativo, institucion
            FROM estudiante 
            WHERE id_alumno = ?;
        `;
        db.query(query, [id_alumno], (err, results) => {
            if (err) {
                return callback(err, null); // Retorna error si ocurre
            }
            if (results.length === 0) {
                return callback(null, null); // No se encontraron datos para el id_alumno
            }
            callback(null, results[0]); // Retorna el registro encontrado
        });
    }

    obtenerDatosProfesionistaPorId(id_alumno, callback) {
        const query = `
            SELECT 
                id_alumno, carrera, lugar_trabajo, puesto, grado_estudios
            FROM profesionistas 
            WHERE id_alumno = ?;
        `;
        db.query(query, [id_alumno], (err, results) => {
            if (err) {
                return callback(err, null); // Retorna error si ocurre
            }
            if (results.length === 0) {
                return callback(null, null); // No se encontraron datos para el id_alumno
            }
            callback(null, results[0]); // Retorna el registro encontrado
        });
    }

    // Actualizar datos del estudiante por id_alumno
    actualizarDatosEstudiantePorId(id_alumno, datosEstudiante, callback) {
        const campos = Object.keys(datosEstudiante).map((campo) => `${campo} = ?`);
        const valores = Object.values(datosEstudiante);
        valores.push(id_alumno);

        const query = `UPDATE estudiante SET ${campos.join(', ')} WHERE id_alumno = ?`;

        db.query(query, valores, (err, result) => {
            if (err) {
                return callback(err, null); // Retorna error si ocurre
            }
            callback(null, result); // Retorna el resultado de la consulta
        });
    }

    actualizarDatosProfesionistaPorId(id_alumno, datosProfesionista, callback) {
        const campos = Object.keys(datosProfesionista).map((campo) => `${campo} = ?`);
        const valores = Object.values(datosProfesionista);
        valores.push(id_alumno);

        const query = `UPDATE profesionistas SET ${campos.join(', ')} WHERE id_alumno = ?`;

        db.query(query, valores, (err, result) => {
            if (err) {
                return callback(err, null); // Retorna error si ocurre
            }
            callback(null, result); // Retorna el resultado de la consulta
        });
    }

    eliminarEstudiantePorId(id_alumno, callback) {
        const query = `DELETE FROM estudiante WHERE id_alumno = ?`;
    
        db.query(query, [id_alumno], (err, result) => {
            if (err) {
                return callback(err, null); // Retorna error si ocurre
            }
            callback(null, result); // Retorna el resultado de la consulta
        });
    }

    eliminarProfesionistaPorId(id_alumno, callback) {
        const query = `DELETE FROM profesionistas WHERE id_alumno = ?`;
    
        db.query(query, [id_alumno], (err, result) => {
            if (err) {
                return callback(err, null); // Retorna error si ocurre
            }
            callback(null, result); // Retorna el resultado de la consulta
        });
    }

    //antony
    getPaqueteVigenteByEmail(email, callback) {
        const query = `
            SELECT 
                alumnos.nombre AS nombre_alumno,
                paquetes.nombre AS nombre_paquete,
                alumnos.apellidos,
                alumnos.email,
                paquetes.descripcion,
                paquetes_adquiridos.fecha_inicio,
                paquetes_adquiridos.fecha_fin,
                paquetes_adquiridos.reservas_disponibles,
                paquetes.costo
            FROM alumnos
            INNER JOIN paquetes_adquiridos ON alumnos.id_alumno = paquetes_adquiridos.id_alumno
            INNER JOIN paquetes ON paquetes_adquiridos.id_paquete = paquetes.id_paquete
            WHERE alumnos.email = ?
            AND paquetes_adquiridos.fecha_fin >= CURDATE();
        `;
    
        db.query(query, [email], (err, results) => {
            if (err) {
                console.error("Error al obtener el paquete vigente del alumno:", err);
                return callback(err, null);
            }
            if (results.length === 0) {
                console.log("No se encontró un paquete vigente para el alumno.");
                return callback(null, null);
            }
            callback(null, results[0]); // Regresamos solo el primer paquete vigente encontrado
        });
    }

    guardarProfesionista(datos, callback) {
        const {
            id_alumno,
            carrera,
            lugar_trabajo,
            puesto,
            grado_estudios
        } = datos;
    
        const query = `
            INSERT INTO profesionistas (
                id_alumno, carrera, lugar_trabajo, puesto, grado_estudios
            )
            VALUES (?, ?, ?, ?, ?)
        `;
    
        const values = [
            id_alumno,
            carrera,
            lugar_trabajo,
            puesto,
            grado_estudios
        ];
    
        db.query(query, values, (err, result) => {
            if (err) {
                return callback(err, null); // Retorna el error al callback si ocurre
            }
            callback(null, result); // Retorna el resultado de la consulta
        });
    }

    getAlumnosAgrupadosPorEdad(callback) {
        const query = 'SELECT edad as label, COUNT(*) as total FROM alumnos GROUP BY edad';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener información de la edad:', err);
                return callback(err, null);
            }
            callback(null, results);
        });
    }

    getAlumnosAgrupadosPorTipo(callback) {
        const query = 'SELECT type_alumno as label, COUNT(*) as total FROM alumnos GROUP BY type_alumno';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener información del tipo de alumno:', err);
                return callback(err, null);
            }
            callback(null, results);
        });
    }

    getTotalPaquetesAdquiridosDeAlumnos(callback) {
        const query = 'SELECT paquetes.nombre as label, COUNT(*) as total FROM alumnos INNER JOIN paquetes_adquiridos ON paquetes_adquiridos.id_alumno = alumnos.id_alumno INNER JOIN paquetes ON paquetes.id_paquete = paquetes_adquiridos.id_paquete GROUP BY paquetes.nombre;';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener información del tipo de alumno:', err);
                return callback(err, null);
            }
            callback(null, results);
        });
    }
    
}


export default new Alumno();