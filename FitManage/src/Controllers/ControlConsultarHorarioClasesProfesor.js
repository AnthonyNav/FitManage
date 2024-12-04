import alumno from '../Models/Alumno.js'
import users from '../Models/Users.js'
import Horario from '../Models/Horario.js';
import Reserva from '../Models/ReservaClase.js';
import Paquetes_Adquiridos from '../Models/Paquetes_Adquiridos.js';
import Profesor from '../Models/Profesor.js';

class ControlConsultarHorarioClasesProfesor {
    constructor() { }

    renderPantallaHorarioProfesor = (req, res) => {
        Profesor.getProfesorIdPorEmail(req.session.user.email, (err, idProfesor) => {
            if (err) {
                console.error('Error al obtener el ID del profesor:', err);
            } else if (idProfesor) {
                console.log(`El ID del profesor es: ${idProfesor}`);

                Horario.obtenerHorariosPorProfesor(idProfesor, (err, horarios) => {
                    if (err) {
                        console.error('Error al obtener los horarios:', err);
                    } else {
                        console.log('Horarios del profesor:', horarios);
                    }

                    const nextDays = [];
        
                    console.log(nextDays);
        
                    res.render('PantallaConsultarHorarioClasesProfesor', {
                        clases: horarios || [], // Asegúrate de que `resultados` sea un array
                        dias: nextDays,
                    });
                });



            } else {
                console.log('No se encontró un profesor con ese email.');
            }
        });

        

    };

    




}

export default new ControlConsultarHorarioClasesProfesor();
