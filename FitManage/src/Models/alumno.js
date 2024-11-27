import db from '../database/conexion.js';

class alumno{

    constructor(){

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
}


export default new alumno();