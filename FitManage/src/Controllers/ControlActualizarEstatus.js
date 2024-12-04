import alumno from '../Models/Alumno.js'
import users from '../Models/Users.js'

class ControlActualizarEstatus {
    constructor() { }

    renderPantallaActualizarEstatus = (req, res) => {

        users.obtenerDatosUsuarios((err, resultados) => {
            if (err) {
                console.error("Error al obtener los datos:", err);
                return;
            }

            const alumnos = resultados;
            res.render('ActualizarEstatusUsuario', { alumnos });
        });


    };

    handleActualizarEstatus = (req, res) => {
        const { usuarios } = req.body; // Recibe el arreglo enviado desde el cliente

        // Responde con un mensaje para confirmar que los datos fueron recibidos
        res.status(200).json({ mensaje: 'Datos del Usuario Actualizado.' });

        users.actualizarEstatusUsuarios(usuarios, (err, resultados) => {
            if (err) {
                console.error('Error al actualizar usuarios:', err.message);
            } else {
                console.log('Actualización exitosa para todos los usuarios:', resultados);
            }
        });

    };



}

export default new ControlActualizarEstatus();
