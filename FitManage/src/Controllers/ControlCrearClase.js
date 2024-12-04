import Disciplinas from '../Models/Disciplinas.js';
import Profesor_Disciplinas from '../Models/Profesor_Disciplina.js';
import Horario from '../Models/Horario.js';
class ControlCrearClase {
    constructor() { }

    renderPantallaCrearClase = async (req, res) => {
        try {
            const { disciplina } = req.query; // Este es el ID de la disciplina seleccionado

            // Obtenemos todas las disciplinas con id y nombre
            const disciplinas = await Disciplinas.obtenerDisciplinas();

            let profesores = [];
            let disciplinaSeleccionada = null;

            if (disciplina) {
                // Busca la disciplina seleccionada por su ID
                disciplinaSeleccionada = disciplinas.find(d => d.id_disciplina == disciplina);

                if (disciplinaSeleccionada) {
                    // Obtenemos los profesores asociados al ID de la disciplina seleccionada
                    profesores = await Profesor_Disciplinas.obtenerProfesoresPorDisciplina(disciplinaSeleccionada.id_disciplina);
                }
            }

            // Renderizamos el EJS
            return res.render("PantallaCrearClase", {
                disciplinas, // Lista de disciplinas (id y nombre)
                disciplinaSeleccionada: disciplinaSeleccionada ? disciplinaSeleccionada.id_disciplina : "",
                profesores // Lista de profesores para la disciplina seleccionada
            });
        } catch (error) {
            console.error("Error al obtener datos para crear clase:", error);
            res.status(500).send("Error interno del servidor");
        }
    };

    handleCrearClase = (req, res) => {
        try {
            const { id_disciplina, id_profesor, dia, hora, cupo } = req.body;

            const horarioData = { id_disciplina, id_profesor, dia, hora, cupo };

            // Verificar si el horario ya existe
            Horario.verificarDuplicidadHorario(horarioData, (err, existe) => {
                if (err) {
                    console.error("Error al verificar horario:", err);
                    return res.status(500).send("Error interno al verificar el horario.");
                }

                if (existe) {
                    return res.status(400).send("La clase ya existe.");
                }

                // Guardar el nuevo horario
                Horario.guardarHorario(horarioData, (err, result) => {
                    if (err) {
                        console.error("Error al guardar horario:", err);
                        return res.status(500).send("Error interno al guardar el horario.");
                    }

                    res.status(200).send("Horario creado correctamente.");
                });
            });
        } catch (error) {
            console.error("Error al manejar la creación de la clase:", error);
            res.status(500).send("Error interno del servidor.");
        }
    };

}

export default new ControlCrearClase();