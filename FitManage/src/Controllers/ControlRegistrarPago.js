import Alumno from '../Models/Alumno.js'
import Paquetes from '../Models/Paquetes.js'
import PaquetesAdquiridos from '../Models/Paquetes_Adquiridos.js';

class ControlRegistrarPago {

    constructor() { }

    handleRegistrarPago = (req, res) => {
        //console.log(req.body);
        const student = req.body;
        // Valida que se haya escojido un paquete
        if (req.body.id_paquete === "-1") {
            Paquetes.getPaquetes(
                (err, rows) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    //console.log(rows);
                    return res.render("PantallaRegistrarPago", { paquetes: rows, student: student, error : "Debe seleccionar un paquete"})
                }
            );
        }

        Paquetes.getPaquetesById(req.body.id_paquete, 
            (err, rows) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                // console.log(rows);

                if(rows.length > 0){

                    const paquete = rows[0];

                    // Obtener la fecha actual y calcular la fecha de finalización
                    const fechaInicio = new Date();
                    const fechaFin = new Date(fechaInicio);
                    fechaFin.setDate(fechaInicio.getDate() + Number(paquete.duracion_dias));

                    // Formatear fechas para MySQL (YYYY-MM-DD)
                    const fecha_inicio = fechaInicio.toISOString().split('T')[0];
                    const fecha_fin = fechaFin.toISOString().split('T')[0];

                    // Preparar los datos para insertar
                    const datos = {
                        id_paquete: paquete.id_paquete,
                        id_alumno: req.body.id_alumno,
                        fecha_inicio,
                        fecha_fin,
                        reservas_disponibles: Number(paquete.reservas)
                    };

                    PaquetesAdquiridos.registrarPaqueteAdquirido(datos, (err, rows) => {
                            if (err) {
                                return res.status(500).json({ error: err.message });
                            }
                            // console.log(rows);
                            return res.status(200).render("administrador", {message: "Paquete Registrado"});
                        }
                    );
                }
                
            }
        );
    }

    handleObtenerPaquetes = (req, res) => {
        // console.log(req.body);
        const student = req.body;
        // Valida que no tenga un paquete vigente o con reservas aun
        PaquetesAdquiridos.getPaquetesVigentesByAlumno(req.body.id_alumno, (err, rows) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                // console.log(rows);
                if(rows.length > 0){
                    return res.status(200).render("administrador", {message: "El alumno ya cuenta con un paquete vigente con reservas disponibles"});
                } 
                else {
                    Paquetes.getPaquetes(
                        (err, rows) => {
                            if (err) {
                                return res.status(500).json({ error: err.message });
                            }
                            // console.log(rows);
                            return res.render("PantallaRegistrarPago", { paquetes: rows, student: student, error : ""})
                        }
                    );
                }
            }
        );
        
    }

    handleObtenerAlumnos = (req, res) => {
        Alumno.getAlumnos((err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            // console.log(rows);
            if (rows.length > 0) {
                return res.render("PantallaSeleccionarAlumnos",  { students: rows, error : ""})
            } else {
                return res.status(500).json({ error: "No se obtuvo al alumno " });
            }
        });
    }

}

export default new ControlRegistrarPago();