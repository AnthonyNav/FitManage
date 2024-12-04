import alumno from '../Models/Alumno.js'
import users from '../Models/Users.js'
import Horario from '../Models/Horario.js';
import Reserva from '../Models/ReservaClase.js';
import Paquetes_Adquiridos from '../Models/Paquetes_Adquiridos.js';

class ControlReservarClase {
    constructor() { }

    renderPantallaReservarClase = (req, res) => {
        Horario.obtenerHorarios((err, resultados) => {
            if (err) {
                console.error('Error al obtener horarios:', err);
                return res.status(500).send('Error en el servidor');
            }

            const daysOfWeek = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
            const today = new Date().getDay(); // Obtiene el índice del día actual (0=domingo, 1=lunes, ..., 6=sábado)



            // Calcular el índice ajustado para excluir el domingo
            const adjustedIndex = today === 0 ? 6 : today - 1; // Si es domingo, ajusta al final del arreglo (sábado)

            // Crear un arreglo con los días siguientes al día actual, hasta el sábado
            const nextDays = [];
            for (let i = adjustedIndex + 1; i < daysOfWeek.length; i++) {
                nextDays.push(daysOfWeek[i]);
            }

            console.log(nextDays);

            res.render('PantallaReservarClase', {
                clases: resultados || [], // Asegúrate de que `resultados` sea un array
                dias: nextDays,
            });
        });

    };

    handleReservarClase = (req, res) => {
        const { disciplina, profesor, dia, hora, cupo, nrc } = req.body;


        alumno.obtenerIdPorEmail(req.session.user.email, (err, idAlumno) => {
            if (err) {
                console.error('Error al obtener el ID del alumno:', err);
                return res.status(200).send({ message: 'Error al obtener el ID del alumno:' });
            }

            if (!idAlumno) {
                console.log('No se encontró ningún alumno con ese email');
                return res.status(200).send({ message: 'No se encontró ningún alumno con ese email' });
            }

            let reserva = {};
            reserva.id_alumno = idAlumno;;
            reserva.nrc = nrc;
            reserva.fecha_clase = this.getNextDateForDay(dia);

            Reserva.verificarReserva({ id_alumno: idAlumno, nrc: nrc, fecha_clase: this.getNextDateForDay(dia) }, (err, existeReserva) => {
                if (err) {
                    // Manejo del error
                    console.error('Hubo un error al verificar la reserva:', err);
                    return res.status(200).send({ message: 'Hubo un error al verificar la reserva:' });
                } else if (existeReserva) {
                    console.error('Ya existe una reserva con esos datos.', err);
                    return res.status(200).send({ message: 'Ya existe una reserva con esos datos.' });
                } else {

                    let reservaT = {};
                    reservaT.id_alumno = idAlumno;
                    reservaT.nrc = nrc;
                    reservaT.fecha_clase = this.getNextDateForDay(dia);


                    Horario.actualizarCupoPorNrc(nrc, (err, resultado) => {
                        if (err) {
                            console.error('Error al actualizar el cupo:', err.message);
                            return res.status(200).send({ message: 'Error al actualizar el cupo' });
                        }
                    
                        if (resultado.actualizado) {
                            

                            Paquetes_Adquiridos.getReservasDisponiblesYFechaFin(idAlumno, (err, paquetes) => {
                                if (err) {
                                    console.error("Error al obtener los datos del alumno:", err.message);
                                    return res.status(200).send({ message: 'Error al obtener los datos del alumno:' });
                                }
                            
                                if (paquetes.length === 0) {
                                    console.log("El alumno no tiene paquetes adquiridos.");
                                    return res.status(200).send({ message: 'El alumno no tiene paquetes adquiridos.' });
                                } else {
                                    console.log("Reservas disponibles y fecha de fin:", paquetes);
                                    const paquete = paquetes[0]
                                    const fechaActual = new Date();

                                    if(paquete.reservas_disponibles > 0 && fechaActual.getTime() < new Date(paquete.fecha_fin).getTime()){
                                        console.log("Entro");

                                        Paquetes_Adquiridos.decrementarReservas(idAlumno, (err, result) => {
                                            if (err) {
                                                console.error("Error:", err.message);
                                            } else {
                                                console.log("Resultado:", result);
                                                Reserva.guardarReserva(reservaT, (err, result) => {
                                                    if (err) {
                                                        // Manejar el error
                                                        console.error('Error al guardar la reserva:', err.message);
                                                        return res.status(200).send({ message: 'Error al guardar la reserva:' });
                                                    }
                            
                                                    // Confirmación de éxito
                                                    return res.status(200).send({ message: 'Clase reservada con éxito' });
                            
                            
                                                });

                                            }
                                        });
                                        

                                    }else{
                                        if(paquete.reservas_disponibles < 1){
                                            return res.status(200).send({ message: 'Ya no tienes reservas disponibles' });
                                        }
                                    }
                                    
                                }
                            });

                            //!MEtodos guardar
                            
                        } else {
                            console.log(resultado.mensaje); // Ejemplo: "El cupo ya está en 0" o "Horario no encontrado"
                        }
                    });
                    

                    
                }
            });


        });


    };

    getNextDateForDay(targetDayName) {
        const daysOfWeek = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        const targetDay = daysOfWeek.indexOf(targetDayName.toLowerCase()); // Índice del día objetivo
        if (targetDay === -1) {
            throw new Error('Día inválido. Usa días como: lunes, martes, miércoles...');
        }

        const today = new Date(); // Fecha actual
        const todayIndex = today.getDay(); // Índice del día actual (0=domingo, ..., 6=sábado)

        // Calcular los días hasta el próximo día objetivo
        const daysUntilNext = (targetDay - todayIndex + 7) % 7 || 7;

        // Calcular la fecha futura
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + daysUntilNext);

        // Devolver en formato "yyyy-mm-dd"
        return nextDate.toISOString().split('T')[0];
    };




}

export default new ControlReservarClase();
