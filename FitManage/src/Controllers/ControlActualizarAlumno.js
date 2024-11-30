import alumno from '../Models/alumno.js'

class ControlActualizarAlumno {
    constructor() {}

    renderPantallaActualizar = (req, res) => {
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
            return res.render("ActualizarAlumno", { alumno: infoAlumno });
        });
    };


    handleActualizarAlumno = (req, res) => {
        let { id_alumno, nombre, apellidos, edad, domicilio, peso, estatura, telefono, aspiraciones, email, fecha_nacimiento, lugar_nacimiento, problemas_salud, certificado_medico, formato_firmado, estudiante } = req.body;
        if(estudiante === "si"){
            estudiante = 1;

        }else{
            estudiante = 0;
        }
        // Obtener los datos actuales del alumno
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
                nombre, apellidos, edad, domicilio, peso, estatura, telefono, aspiraciones, email, fecha_nacimiento, lugar_nacimiento, problemas_salud, certificado_medico, formato_firmado, estudiante,
            };

            // Actualizar los datos en la base de datos
            const realizarActualizacion = (cambios) => {
                alumno.actualizarAlumnoPorId(id_alumno, cambios, (err, resultado) => {
                    if (err) {
                        console.error('Error al actualizar los datos del alumno:', err);
                        return res.status(500).json({ error: 'Error al actualizar los datos del alumno.' });
                    }

                    if(estudiante === 1){
                        
                        alumno.obtenerDatosEstudiantePorId(id_alumno, (err, datosEstudiante) => {
                            if (err) {
                                console.error("Error al obtener los datos del estudiante:", err);
                                return;
                            }
                        
                            if (!datosEstudiante) {
                                console.log("No se encontró información para el ID del alumno.");
                                return;
                            }
                        
                            // codigo
                            return res.render("ActualizarEstudiante", { estudiante:  datosEstudiante});
                        });
            
            
                    }else{
                        return res.status(200).json({ mensaje: 'Datos actualizados correctamente.' });
                    }

                    
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
                alumno.verificarDuplicados(
                    cambios.nombre || datosActuales.nombre,
                    cambios.email || datosActuales.email,
                    id_alumno,
                    (err, duplicado) => {
                        if (err) {
                            console.error('Error al verificar duplicados:', err);
                            return res.status(500).json({ error: 'Error interno del servidor.' });
                        }

                        if (duplicado) {
                            return res.status(400).json({ error: 'El nombre o email ya existen en la base de datos.' });
                        }

                        // Actualizar los cambios
                        realizarActualizacion(cambios);
                    }
                );
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
    
    
}

export default new ControlActualizarAlumno();
