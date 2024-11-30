import db from '../database/conexion.js';

class alumno {

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

    guardarAlumno(datos, callback) {
        const {
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
            estudiante,
            fecha_ingreso, // Agregamos el nuevo campo
        } = datos;

        const query = `
            INSERT INTO alumnos (
                nombre, apellidos, edad, domicilio, peso, estatura,
                telefono, aspiraciones, email, fecha_nacimiento,
                lugar_nacimiento, problemas_salud, certificado_medico,
                formato_firmado, estudiante, fecha_ingreso
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            estudiante,
            fecha_ingreso,
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        });
    }


    guardarEstudiante(datos, callback) {
        const {
            id_alumno,
            nivel_educativo,
            grado_estudios,
            institucion,
            carrera,
            lugar_trabajo,
            puesto,
        } = datos;

        const query = `
            INSERT INTO estudiante (
                id_alumno, nivel_educativo, grado_estudios, institucion,
                carrera, lugar_trabajo, puesto
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            id_alumno,
            nivel_educativo,
            grado_estudios,
            institucion,
            carrera,
            lugar_trabajo,
            puesto,
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

    obtenerNombresYEstatus(callback) {
        const query = `SELECT nombre, estatus FROM alumnos`;

        db.query(query, (err, rows) => {
            if (err) {
                return callback(err, null); // Retorna error al callback si ocurre
            }
            callback(null, rows); // Retorna los nombres y estatus
        });
    }

    obtenerInfoCompleta(nombre, callback) {
        const query = `
            SELECT 
                id_alumno, nombre, apellidos, edad, domicilio, telefono, email, 
                fecha_nacimiento, lugar_nacimiento, peso, estatura, 
                estudiante, problemas_salud, aspiraciones, 
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
            alumno.estudiante = alumno.estudiante === 1 ? 'Sí' : 'No'; // Convertimos el booleano en texto
            callback(null, alumno);
        });
    }









    // Obtener información completa por ID
    obtenerInfoPorId(id_alumno, callback) {
        const query = `
            SELECT 
                id_alumno, nombre, apellidos, edad, domicilio, telefono, email, 
                fecha_nacimiento, lugar_nacimiento, peso, estatura, 
                estudiante, problemas_salud, aspiraciones, 
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

    obtenerDatosEstudiantePorId(id_alumno, callback) {
        const query = `
            SELECT 
                id_alumno, nivel_educativo, institucion, carrera, 
                lugar_trabajo, puesto, grado_estudios 
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

}


export default new alumno();