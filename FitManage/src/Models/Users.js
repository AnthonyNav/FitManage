import db from '../database/conexion.js';

class Users{

    constructor(){

    }
    buscarEmail(email, callback) {
        // Consulta para buscar el registro
        db.query(
            `SELECT * FROM users WHERE email = ? AND email LIKE '%@gmail.com'`,
            [email],
            (err, rows) => {
                if (err) {
                    return callback(err, null);
                }
                // Devuelve los resultados al controlador
                callback(null, rows);
            }
        );
    }

    registrarUsuario(datos, callback){

        // Query SQL corregido
        const query = `
            INSERT INTO users (
                email, password, type_user, active
            )
            VALUES (?, ?, ?, ?)
        `;
    
        const values = [
            datos.email,
            datos.password,
            datos.type_user,
            datos.active
        ];
    
        // Ejecución de la consulta
        db.query(query, values, (err, result) => {
            if (err) {
                console.error("Error al guardar el usuario:", err);
                return callback(err, null); 
            }
            console.log("Usuario guardado correctamente");
            callback(null, result); 
        });
    }

    buscarIdPorEmail(email, callback) {
        // Consulta para obtener el id_user asociado al email
        const query = `SELECT id_user FROM users WHERE email = ?`;
    
        db.query(query, [email], (err, rows) => {
            if (err) {
                console.error("Error al buscar el id_user por email:", err);
                return callback(err, null); // Devuelve el error al controlador
            }
    
            // Si no hay resultados, devuelve un error personalizado
            if (rows.length === 0) {
                return callback(new Error("No se encontró un usuario con el email proporcionado."), null);
            }
    
            // Devuelve el id_user al controlador
            callback(null, rows[0].id_user);
        });
    }

    actualizarDatosPorId(id_user, datosActualizar, callback) {
        // Construir los campos dinámicamente a partir de los datos a actualizar
        const campos = Object.keys(datosActualizar).map(
            (campo) => `${campo} = ?`
        );
        const valores = Object.values(datosActualizar);
        valores.push(id_user); // Agregar el id_user al final para la consulta

        // Query de actualización
        const query = `UPDATE users SET ${campos.join(", ")} WHERE id_user = ?`;

        db.query(query, valores, (err, result) => {
            if (err) {
                console.error("Error al actualizar los datos del usuario:", err);
                return callback(err, null); // Retorna el error si ocurre
            }
            console.log("Datos del usuario actualizados correctamente");
            callback(null, result); // Retorna el resultado de la consulta
        });
    }

    obtenerPasswordPorId(id_user, callback) {
        const query = `SELECT password FROM users WHERE id_user = ?`;

        db.query(query, [id_user], (err, rows) => {
            if (err) {
                console.error("Error al obtener el password:", err);
                return callback(err, null);
            }

            if (rows.length === 0) {
                return callback(
                    new Error("No se encontró un usuario con el ID proporcionado."),
                    null
                );
            }

            // Devuelve solo el campo `password`
            callback(null, rows[0].password);
        });
    }

    obtenerDatosUsuarios(callback) {
        const queryUsuarios = `
            SELECT id_user, active, type_user 
            FROM users 
            WHERE type_user != 'administrador'
        `;
    
        db.query(queryUsuarios, (err, usuarios) => {
            if (err) {
                console.error("Error al obtener los usuarios:", err);
                return callback(err, null);
            }
    
            // Procesar cada usuario para obtener su estatus, nombre y type_user
            const resultados = [];
            const promises = usuarios.map((usuario) => {
                return new Promise((resolve) => {
                    const estatus = usuario.active === 1 ? "Activo" : "Inactivo";
    
                    // Determinar la tabla donde buscar el nombre
                    const tabla = usuario.type_user === "alumno" ? "alumnos" : "profesor";
                    const queryNombre = `
                        SELECT nombre 
                        FROM ${tabla} 
                        WHERE id_user = ?
                    `;
    
                    db.query(queryNombre, [usuario.id_user], (err, rows) => {
                        if (err || rows.length === 0) {
                            console.error(`Error al obtener el nombre para id_user ${usuario.id_user}:`, err);
                            resolve({
                                type_user: usuario.type_user,
                                estatus,
                                nombre: "Nombre no encontrado",
                            });
                        } else {
                            resolve({
                                type_user: usuario.type_user,
                                estatus,
                                nombre: rows[0].nombre,
                            });
                        }
                    });
                });
            });
    
            // Esperar a que todas las promesas se resuelvan
            Promise.all(promises)
                .then((datos) => callback(null, datos))
                .catch((err) => callback(err, null));
        });
    }
    
    
    actualizarEstatusUsuarios(usuarios, callback) {
        // Convertir cada operación de actualización en una Promesa
        const promesas = usuarios.map(({ nombre, type_user, estatus }) => {
            return new Promise((resolve, reject) => {
                // Determinar la tabla según el tipo de usuario
                const tabla = type_user === 'alumno' ? 'alumnos' : 'profesor';
    
                // Query para buscar el id_user según el nombre
                const queryBuscarId = `SELECT id_user FROM ${tabla} WHERE nombre = ?`;
    
                db.query(queryBuscarId, [nombre], (err, rows) => {
                    if (err) {
                        console.error(`Error al buscar id_user en la tabla ${tabla}:`, err);
                        return reject(err);
                    }
    
                    if (rows.length === 0) {
                        const error = new Error(`No se encontró un usuario con el nombre "${nombre}" en la tabla ${tabla}.`);
                        console.error(error.message);
                        return reject(error);
                    }
    
                    const id_user = rows[0].id_user;
    
                    // Determinar el valor de active basado en el estatus
                    const active = estatus === 'Activo' ? 1 : 0;
    
                    // Query para actualizar el campo active en la tabla users
                    const queryActualizar = `UPDATE users SET active = ? WHERE id_user = ?`;
    
                    db.query(queryActualizar, [active, id_user], (err, result) => {
                        if (err) {
                            console.error(`Error al actualizar el campo active para id_user ${id_user}:`, err);
                            return reject(err);
                        }
    
                        console.log(`El campo active para id_user ${id_user} se actualizó correctamente a ${active}.`);
                        resolve(result);
                    });
                });
            });
        });
    
        // Esperar a que todas las Promesas se resuelvan
        Promise.all(promesas)
            .then((resultados) => {
                console.log("Todos los usuarios se actualizaron correctamente.");
                callback(null, resultados); // Devuelve todos los resultados
            })
            .catch((err) => {
                console.error("Error al actualizar uno o más usuarios:", err);
                callback(err, null); // Devuelve el error
            });
    }
    
}


export default new Users();