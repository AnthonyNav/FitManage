
import Disciplinas from "../Models/Disciplinas.js";
import Profesor from "../Models/Profesor.js";
import Profesor_Disciplinas from "../Models/Profesor_Disciplina.js";
import Users from "../Models/Users.js"

class ControlRegistrarProfesor {
    constructor() {}

    async renderPaginaRegistrarProfesor(req, res) {
        try {
            const disciplinas = await Disciplinas.obtenerDisciplinas();
            res.render("PantallaRegistrarProfesor", { disciplinas, error: "" });
        } catch (err) {
            console.error("Error al obtener disciplinas:", err);
            res.status(500).send("Error interno del servidor");
        }
    }

    handleRegistrarProfesor = async (req, res) => {
        try {
            const { nombre, email, password,  edad, telefono, disciplinas1, disciplinas2, disciplinas3, disciplinas4 } = req.body;
            console.log(req.body);

            // Filtrar y validar disciplinas seleccionadas
            const disciplinas = [disciplinas1, disciplinas2, disciplinas3, disciplinas4].filter(d => d && d !== "-1");

            if (disciplinas.length === 0) {
                return res.status(400).render("PantallaRegistrarProfesor", {
                    disciplinas: await Disciplinas.obtenerDisciplinas(),
                    error: "Debe seleccionar al menos una disciplina",
                });
            }

            const disciplinasUnicas = [...new Set(disciplinas)];
            if (disciplinasUnicas.length !== disciplinas.length) {
                return res.status(400).render("PantallaRegistrarProfesor", {
                    disciplinas: await Disciplinas.obtenerDisciplinas(),
                    error: "No puede seleccionar la misma disciplina más de una vez",
                });
            }

            // Verificar si el profesor ya está registrado
            const profesorExistente = await new Promise((resolve, reject) => {
                Profesor.getProfesor(email, (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows.length > 0);
                });
            });

            if (profesorExistente) {
                return res.status(400).render("PantallaRegistrarProfesor", {
                    disciplinas: await Disciplinas.obtenerDisciplinas(),
                    error: "Ya existe un profesor registrado con este email",
                });
            }

            // Validar formato del correo
            const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
            if (!emailRegex.test(email)) {
                return res.status(400).render("PantallaRegistrarProfesor", {
                    disciplinas: await Disciplinas.obtenerDisciplinas(),
                    error: "El correo debe tener un formato válido de @gmail.com",
                });
            }

            // Guardar datos del profesor
            const datosProfesor = { nombre, edad, telefono, email };
            await new Promise((resolve, reject) => {
                Profesor.guardarProfesor(datosProfesor, (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });

            // Obtener el ID del profesor recién registrado
            const profesor = await new Promise((resolve, reject) => {
                Profesor.getProfesor(email, (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows[0]);
                });
            });

            // Guardar todas las disciplinas seleccionadas
            for (const id_disciplina of disciplinasUnicas) {
                await new Promise((resolve, reject) => {
                    Profesor_Disciplinas.guardarDisciplinaDeProfesor(
                        { id_profesor: profesor.id_profesor, id_disciplina },
                        (err, result) => {
                            if (err) return reject(err);
                            resolve(result);
                        }
                    );
                });
            }

            // Registro de profesor en usuarios

            // Registro de profesor en usuarios
            const UserData = {
                email: email,
                password: password, 
                type_user: "profesor",
                active: 1
            };

            await new Promise((resolve, reject) => {
                Users.registrarUsuario(UserData, (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            }); 

            // Confirmar el registro (Redirigir en el futuro)
            return res.status(200).render("administrador", {message: "Profesor registrado correctamente"});

        } catch (error) {
            console.error("Error al registrar profesor:", error);
            return res.status(500).render("PantallaRegistrarProfesor", {
                disciplinas: await Disciplinas.obtenerDisciplinas(),
                error: "Error interno del servidor",
            });
        }
    };
    
}

export default new ControlRegistrarProfesor();

