import alumno from '../Models/Alumno.js'
import users from '../Models/Users.js'

class ControlActualizarAlumno {
    constructor() { }

    renderPantallaActualizar = (req, res) => {
        // ? Revisar el uso de estatus
        alumno.obtenerNombresYEstatus((err, alumnos) => {
            if (err) {
                console.error('Error al obtener los alumnos:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            // Renderizar la vista con los datos obtenidos
            res.render('PantallaActualizarAlumno', { alumnos });
        });

        
    };

    handleSeleccionarAlumno = (req, res) => {
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({ error: "No se proporcionó el nombre del alumno." });
        }

        alumno.obtenerInfoCompleta(nombre, (err, infoAlumno) => {
            if (err) {
                console.error('Error al obtener información del alumno:', err);
                return res.status(500).json({ error: 'Error al obtener información del alumno.' });
            }

            if (!infoAlumno) {
                return res.status(404).json({ error: 'Alumno no encontrado.' });
            }

            console.log('Información completa del alumno:', infoAlumno);
            users.obtenerPasswordPorId(infoAlumno.id_user, (err, password) => {
                if (err) {
                    console.error("Error al obtener el password:", err);
                    return res.status(500).json({
                        error: true,
                        mensaje: "Error al obtener el password del usuario",
                    });
                }

                return res.render("ActualizarAlumno", { alumno: infoAlumno, password: password });
            });
        });
    };


    handleActualizarAlumno = (req, res) => {
        let { id_alumno, id_user, password, nombre, apellidos, edad, domicilio, peso, estatura, telefono, aspiraciones, email, fecha_nacimiento, lugar_nacimiento, problemas_salud, certificado_medico, formato_firmado, type_alumno } = req.body;

        const userData = { email, password, };

        alumno.obtenerInfoPorId(id_alumno, (err, datosActuales) => {
            if (err) {
                console.error('Error al consultar la base de datos:', err);
                return res.status(500).json({ error: 'Error interno del servidor.' });
            }

            if (!datosActuales) {
                return res.status(404).json({ error: 'El alumno no existe.' });
            }

            // Detectar cambios
            const cambios = {};
            const camposAComparar = {
                nombre, apellidos, edad, domicilio, peso, estatura, telefono, aspiraciones, email, fecha_nacimiento, lugar_nacimiento, problemas_salud, certificado_medico, formato_firmado, type_alumno,
            };

            // Actualizar los datos en la base de datos
            const realizarActualizacion = (cambios) => {

                users.actualizarDatosPorId(id_user, userData, (err, result) => {
                    if (err) {
                        console.error("Error al actualizar usuario:", err);
                        return res.status(500).json({
                            error: true,
                            mensaje: 'Error al actualizar los datos del usuario',
                        });
                    }

                    // Si no se encontraron filas afectadas, el ID no existe
                    if (result.affectedRows === 0) {
                        return res.status(404).json({
                            error: true,
                            mensaje: 'Usuario no encontrado',
                        });
                    }

                    // Respuesta exitosa
                    alumno.actualizarAlumnoPorId(id_alumno, cambios, (err, resultado) => {
                        if (err) {
                            console.error('Error al actualizar los datos del alumno:', err);
                            return res.status(500).json({ error: 'Error al actualizar los datos del alumno.' });
                        }

                        switch (type_alumno) {
                            case "estudiante": {

                                alumno.eliminarProfesionistaPorId(id_alumno, (err, result) => {
                                    if (err) {
                                        console.error('Error al eliminar el profesionista:', err);
                                        return res.status(500).json({ error: 'Error al eliminar el profesionista' });
                                    }

                                    alumno.obtenerDatosEstudiantePorId(id_alumno, (err, datosEstudiante) => {
                                        if (err) {
                                            console.error("Error al obtener los datos del estudiante:", err);
                                            return;
                                        }
    
                                        if (!datosEstudiante) {
                                            console.log("No se encontró información para el ID del alumno.");
    
                                            return res.render("registroEstudiante", { email: email });
                                        }
    
                                        // codigo
                                        return res.render("ActualizarEstudiante", { estudiante: datosEstudiante });
                                    });
                            
                                    
                                });
                                
                                

                                break;

                            }

                            case "profesionista": {
                                alumno.eliminarEstudiantePorId(id_alumno, (err, result) => {
                                    if (err) {
                                        console.error('Error al eliminar estudiante:', err);
                                        return res.status(500).json({ error: 'Error al eliminar el estudiante.' });
                                    }
                                    alumno.obtenerDatosProfesionistaPorId(id_alumno, (err, profesionista) => {
                                        if (err) {
                                            console.error('Error al obtener los datos del profesionista:', err);
                                            return res.status(500).send('Error del servidor');
                                        }
                                
                                        if (!profesionista) {
                                            return res.render("RegistroProfesionista", { email: email });
                                        }
                                
                                        // Renderiza la vista del formulario con los datos obtenidos
                                        return res.render("ActualizarRegistroProfesionista", { profesionista: profesionista });
                                    });
                                });
                                break;

                            }

                            case "ninguno": {   
                                alumno.eliminarEstudiantePorId(id_alumno, (err, result) => {
                                    if (err) {
                                        console.error('Error al eliminar estudiante:', err);
                                        return res.status(500).json({ error: 'Error al eliminar el estudiante.' });
                                    }
                                    alumno.eliminarProfesionistaPorId(id_alumno, (err, result) => {
                                        if (err) {
                                            console.error('Error al eliminar el profesionista:', err);
                                            return res.status(500).json({ error: 'Error al eliminar el profesionista' });
                                        }
                                
                                        return res.status(200).json({ message: 'Profesionista eliminado exitosamente' });
                                    });
                                });

                                break;
                            }
                        }

                        /* if(estudiante === 1){
                            alumno.obtenerDatosEstudiantePorId(id_alumno, (err, datosEstudiante) => {
                                if (err) {
                                    console.error("Error al obtener los datos del estudiante:", err);
                                    return;
                                }
                            
                                if (!datosEstudiante) {
                                    console.log("No se encontró información para el ID del alumno.");
    
                                    return res.render("registroEstudiante", { email: email });
                                }
                            
                                // codigo
                                return res.render("ActualizarEstudiante", { estudiante:  datosEstudiante});
                            });
                
                
                        }else{
    
                            alumno.eliminarEstudiantePorId(id_alumno, (err, result) => {
                                if (err) {
                                    console.error('Error al eliminar estudiante:', err);
                                    return res.status(500).json({ error: 'Error al eliminar el estudiante.' });
                                }
                                if (result.affectedRows === 0) {
                                    return res.status(200).json({ mensaje: 'Datos actualizados correctamente.' });
                                }
                                return res.status(200).json({ mensaje: 'Datos actualizados correctamente.' });
                            });
    
    
                            
                        } */


                    });
                });

            };

            Object.keys(camposAComparar).forEach((campo) => {
                if (camposAComparar[campo] !== datosActuales[campo]) {
                    cambios[campo] = camposAComparar[campo];
                }
            });

            if (Object.keys(cambios).length === 0) {
                return res.status(200).json({ mensaje: 'No se detectaron cambios.' });
            }

            // Verificar duplicados en nombre y email si han cambiado
            if (cambios.nombre || cambios.email) {
                alumno.verificarDuplicados(cambios.nombre || datosActuales.nombre, cambios.email || datosActuales.email, id_alumno, (err, duplicado) => {
                    if (err) {
                        console.error('Error al verificar duplicados:', err);
                        return res.status(500).json({ error: 'Error interno del servidor.' });
                    }

                    if (duplicado) {
                        return res.status(400).json({ error: 'El nombre o email ya existen en la base de datos.' });
                    }

                    // Actualizar los cambios
                    realizarActualizacion(cambios);

                });
            } else {
                // Actualizar directamente si no hay cambios en nombre o email
                realizarActualizacion(cambios);
            }


        });
    };

    handleActualizarEstudiante = (req, res) => {

        const { id_alumno, ...datosEstudiante } = req.body;

        alumno.actualizarDatosEstudiantePorId(id_alumno, datosEstudiante, (err, result) => {
            if (err) {
                console.error('Error al actualizar los datos del estudiante:', err);
                return res.status(500).json({ error: 'Error al actualizar los datos del estudiante.' });
            }
            res.status(200).json({ mensaje: 'Datos del estudiante actualizados correctamente.' });
        });

    };

    handleActualizarProfesionista = (req, res) => {

        const { id_alumno, ...datosProfesionista } = req.body;

        alumno.actualizarDatosProfesionistaPorId(id_alumno, datosProfesionista, (err, result) => {
            if (err) {
                console.error('Error al actualizar los datos del profesionista:', err);
                return res.status(500).json({ error: 'Error al actualizar los datos del profesionista.' });
            }
            res.status(200).json({ mensaje: 'Datos del profesionista actualizados correctamente.' });
        });

    };



}

export default new ControlActualizarAlumno();
