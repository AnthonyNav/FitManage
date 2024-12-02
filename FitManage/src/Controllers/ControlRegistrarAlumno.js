import alumno from '../Models/Alumno.js'
import users from '../Models/Users.js';

class ControlRegistrarAlumno {
    constructor() { }

    handleRegistrarAlumno = (req, res) => {
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
            password,
        } = req.body;

        const type_user = "alumno";
        const active = 1;

        const fechaActual = new Date();

        const año = fechaActual.getFullYear();
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
        const dia = String(fechaActual.getDate()).padStart(2, '0');

        const fechaFormateada = `${año}-${mes}-${dia}`;
        console.log(fechaFormateada);

        var datosAlumno = req.body;

        datosAlumno.fecha_ingreso = fechaFormateada;

        datosAlumno.peso = parseFloat(datosAlumno.peso.replace(/[^0-9.]/g, ''));
        datosAlumno.estatura = parseFloat(datosAlumno.estatura.replace(/[^0-9.]/g, ''));
        datosAlumno.estudiante = estudiante === 'si' ? 1 : 0;


        alumno.verificarNombreOEmail(nombre, email, (err, exists) => {
            if (err) {
                console.error('Error al verificar nombre o email:', err);
                return res.status(500).send('Error interno del servidor');
            }

            if (exists) {
                return res.status(400).send('Ya existe un alumno registrado con este nombre o email');
            }

            var UserData = { email, password, type_user, active,};

            delete datosAlumno.password;

            users.registrarUsuario(UserData, (err, result) => {
                if (err) {
                    console.error("Hubo un error al registrar al usuario:", err);
                    return;
                }
            
                users.buscarIdPorEmail(datosAlumno.email, (err, id_user) => {
                    if (err) {
                        console.error("Error:", err.message);
                        return res.status(200).send('Error al buscar id_user');
                    }
    
                    //console.log("ID del usuario:", id_user);
                    datosAlumno.id_user = id_user;
    
                    alumno.guardarAlumno(datosAlumno, (err, result) => {
                        if (err) {
                            console.error('Error al guardar alumno:', err);
                            return res.status(500).send('Error interno al guardar el alumno');
                        }
    
                        if (estudiante === "si") {
                            return res.render("registroEstudiante", { email: datosAlumno.email });
                        } else {
                            return res.status(200).send('Alumno registrado correctamente');
                        }
    
    
                    });
                });
            });

            






        });


    };



    handleRegistrarEstudiante = (req, res) => {
        const {
            email,
            nivel_educativo,
            grado_estudios,
            institucion,
            carrera,
            lugar_trabajo,
            puesto,
        } = req.body;

        const datosEstudiante = req.body;

        alumno.obtenerIdPorEmail(datosEstudiante.email, (err, idAlumno) => {
            if (err) {
                console.error('Error al obtener el ID del alumno:', err);
                return;
            }

            if (!idAlumno) {
                console.log('No se encontró ningún alumno con ese email');
                return;
            }

            datosEstudiante.id_alumno = idAlumno;
            delete datosEstudiante.email;

            alumno.guardarEstudiante(datosEstudiante, (err, result) => {
                if (err) {
                    console.error('Error al guardar estudiante:', err);
                    return res.status(500).send('Error interno al guardar los datos del estudiante');
                }

                res.status(200).send('Estudiante registrado correctamente');
            });

        });


    };
}

export default new ControlRegistrarAlumno();
