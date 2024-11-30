
import Disciplinas from "../Models/Disciplinas.js";
import Profesor from "../Models/Profesor.js";
import Profesor_Disciplinas from "../Models/Profesor_Disciplina.js";
import Users from "../Models/users.js"

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
            const { nombre, email, edad, telefono, disciplinas1, disciplinas2, disciplinas3, disciplinas4 } = req.body;
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

            datos = [
                email,

            ]

            // Registro de profesor para usuarios pendiente

            // Confirmar el registro (Redirigir en el futuro)
            return res.status(200).send("Profesor registrado correctamente con sus disciplinas.");


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


// import Disciplinas from "../Models/Disciplinas.js";
// import Profesor from "../Models/Profesor.js";
// import Profesor_Disciplinas from "../Models/Profesor_Disciplina.js";

// class ControlRegistrarProfesor {
//     constructor() {}
    
//     async renderPaginaRegistrarProfesor(req, res) {
//         try {
//             const disciplinas = await Disciplinas.obtenerDisciplinas();
//             res.render("PantallaRegistrarProfesor", { disciplinas, error: ""});
//         } catch (err) {
//             console.error("Error al obtener disciplinas:", err);
//             res.status(500).send("Error interno del servidor");
//         }
//     }

//     handleRegistrarProfesor = async (req, res) => {
//         try {
//             const { nombre, email, edad, telefono, disciplinas1, disciplinas2, disciplinas3, disciplinas4 } = req.body;
//             console.log(req.body);
//             // Validar y registrar disciplinas
            
//             const disciplinas = [disciplinas1, disciplinas2, disciplinas3, disciplinas4].find(d => d && d !== "-1");
//             // Verificar si hay disciplinas duplicadas
//             const disciplinasUnicas = [...new Set(disciplinas)];
            

//             if (!disciplinas || disciplinas.length === 0) {
//                 return res.status(400).render("PantallaRegistrarProfesor", {
//                     disciplinas: await Disciplinas.obtenerDisciplinas(),
//                     error: "Debe seleccionar al menos una disciplina"
//                 });
//             }

//             if (disciplinasUnicas.length !== disciplinas.length) {
//                 return res.status(400).render("PantallaRegistrarProfesor", { 
//                     disciplinas: await Disciplinas.obtenerDisciplinas(), 
//                     error: "No puede seleccionar la misma disciplina más de una vez" 
//                 });
//             }
    
//             // Verificar si el profesor ya está registrado
//             const profesorExistente = await new Promise((resolve, reject) => {
//                 Profesor.getProfesor(email, (err, rows) => {
//                     if (err) return reject(err);
//                     resolve(rows.length > 0);
//                 });
//             });
    
//             if (profesorExistente) {
//                 return res.status(400).render("PantallaRegistrarProfesor", { 
//                     disciplinas: await Disciplinas.obtenerDisciplinas(), 
//                     error: "Ya existe un profesor registrado con este email" 
//                 });
//             }
    
//             // Validar formato del correo y teléfono
//             const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
//             if (!emailRegex.test(email)) {
//                 return res.status(400).render("PantallaRegistrarProfesor", { 
//                     disciplinas: await Disciplinas.obtenerDisciplinas(), 
//                     error: "El correo debe tener un formato válido de @gmail.com" 
//                 });
//             }

//             // Guardar datos del profesor
//             const datosProfesor = { nombre, edad, telefono, email };
//             await new Promise((resolve, reject) => {
//                 Profesor.guardarProfesor(datosProfesor, (err, result) => {
//                     if (err) return reject(err);
//                     resolve(result);
//                 });
//             });
    
//             // Obtener el ID del profesor recién registrado
//             const profesor = await new Promise((resolve, reject) => {
//                 Profesor.getProfesor(email, (err, rows) => {
//                     if (err) return reject(err);
//                     resolve(rows[0]);
//                 });
//             });
    
//             // Guardar la primera disciplina seleccionada
//             await new Promise((resolve, reject) => {
//                 Profesor_Disciplinas.guardarDisciplinaDeProfesor(
//                     { id_profesor: profesor.id_profesor, id_disciplina: disciplinas },
//                     (err, result) => {
//                         if (err) return reject(err);
//                         resolve(result);
//                     }
//                 );
//             });

//             return res.status(200).send("Profesor registrado correctamente con su disciplina");
//         } catch (error) {
//             console.error("Error al registrar profesor:", error);
//             return res.status(400).render("PantallaRegistrarProfesor", { 
//                 disciplinas: await Disciplinas.obtenerDisciplinas(), 
//                 error: "Error interno del servidor" 
//             });
//         }
//     };

    // handleRegistrarProfesor = async (req, res) => {
    //     try {
    //         const { nombre, email, edad, telefono, disciplinas1, disciplinas2, disciplinas3, disciplinas4 } = req.body;

    //         // Validación del formato de email
    //         const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    //         if (!emailRegex.test(email)) {
    //             return res.status(400).send("El correo debe tener un formato válido de @gmail.com");
    //         }

    //         // Verificar si el profesor ya existe
    //         const profesorExistente = await new Promise((resolve, reject) => {
    //             Profesor.getProfesor(email, (err, rows) => {
    //                 if (err) return reject(err);
    //                 resolve(rows);
    //             });
    //         });

    //         if (profesorExistente.length > 0) {
    //             return res.status(400).send("Ya existe un profesor registrado con este email");
    //         }

    //         // Guardar profesor
    //         const datosProfesor = { nombre, edad, telefono, email };
    //         const resultProfesor = await new Promise((resolve, reject) => {
    //             Profesor.guardarProfesor(datosProfesor, (err, result) => {
    //                 if (err) return reject(err);
    //                 resolve(result);
    //             });
    //         });

    //         // Obtener el ID del profesor recién registrado
    //         const id_profesor = resultProfesor.insertId;

    //         // Validar y registrar disciplinas
    //         const disciplinas = [disciplinas1, disciplinas2, disciplinas3, disciplinas4].filter(d => d && d !== "-1");
    //         if (disciplinas.length === 0) {
    //             return res.status(400).send("Debe seleccionar al menos una disciplina");
    //         }

    //         // Registrar cada disciplina
    //         for (const id_disciplina of disciplinas) {
    //             await new Promise((resolve, reject) => {
    //                 Profesor_Disciplinas.guardarDisciplinaDeProfesor({ id_profesor, id_disciplina }, (err, result) => {
    //                     if (err) return reject(err);
    //                     resolve(result);
    //                 });
    //             });
    //         }

    //         res.status(200).send("Profesor registrado correctamente");
    //     } catch (err) {
    //         console.error("Error al registrar profesor:", err);
    //         res.status(500).send("Error interno del servidor");
    //     }
    // };
// }

// export default new ControlRegistrarProfesor();




// import Disciplinas from "../Models/Disciplinas.js";
// import Profesor from "../Models/Profesor.js";
// import Profesor_Disciplinas from "../Models/Profesor_Disciplina.js";
// class ControlRegistrarProfesor {
//     constructor() {}

//     async renderPaginaRegistrarProfesor(req, res) {
//         try {
//             // Llamar al modelo para obtener las disciplinas
//             const disciplinas = await Disciplinas.obtenerDisciplinas();

//             // Renderizar la página y enviar las disciplinas como datos al cliente
//             res.render("PantallaRegistrarProfesor", { disciplinas });
//         } catch (err) {
//             console.error("Error al obtener disciplinas:", err);
//             res.status(500).send("Error interno del servidor");
//         }
//     }

//     handleRegistrarProfesor = (req, res) => {
//         const {
//             nombre,
//             email,
//             edad,
//             telefono,
//             disciplina1,
//             disciplina2,
//             disciplina3,
//             disciplina4,
//         } = req.body;

//         const datosProfesor = req.body;
    
//         Profesor.getProfesor(email, (err, rows) => {
//             if (err) {
//                 console.error('Error al verificar nombre o email:', err);
//                 return res.status(500).send('Error interno del servidor');
//             }
//             if (rows > 0) {
//                 return res.status(400).send('Ya existe un profesor registrado con este email');
//             }
//             else {
//                  // Verificación de formato de correo
//                 const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
//                 if (!emailRegex.test(email)) {
//                     return callback(new Error("El correo debe tener un formato válido de @gmail.com"), null);
//                 }

//                 const telefonoRegex = /^[0-9]{10,}$/;
//                 if (!telefonoRegex.test(telefono)) {
//                     return callback(new Error("El número de teléfono debe tener al menos 10 dígitos"), null);
//                 }
//                 Profesor.guardarProfesor(datosProfesor, (err, result) => {
//                     if (err) {
//                         console.error('Error al guardar profesor:', err);
//                         return res.status(500).send('Error interno al guardar profesor');
//                     }
                    
//                     // Registrar las disciplinas del profesor
//                     Profesor.getProfesor(email, (err, rows) => {
//                         if (err) {
//                             console.error('Error al guardar profesor:', err);
//                             return res.status(500).send('Error interno al guardar profesor_disciplina');
//                         }
//                         const profesor = rows[0];
//                         let flag = 0;
//                         if(disciplina1 != "-1") {
//                             Profesor_Disciplinas.guardarDisciplinaDeProfesor(profesor.id_profesor, disciplina1);
//                             flag = 1;
//                         }
//                         if(disciplina2 != "-1") {
//                             Profesor_Disciplinas.guardarDisciplinaDeProfesor(profesor.id_profesor, disciplina2);
//                             flag = 1;
//                         }
//                         if(disciplina3 != "-1") {
//                             Profesor_Disciplinas.guardarDisciplinaDeProfesor(profesor.id_profesor, disciplina3);
//                             flag = 1;
//                         }
//                         if(disciplina4 != "-1") {
//                             Profesor_Disciplinas.guardarDisciplinaDeProfesor(profesor.id_profesor, disciplina4);
//                             flag = 1;
//                         }
//                         if(flag == 0) {res.status(500).send('Debe seleccionar almenos una disciplina')};

//                     });
//                     return res.status(200).send('Profesor registrado correctamente');
//                 });

//             }
//         });
//     };
// }

// export default new ControlRegistrarProfesor();










// import Profesor from '../Models/Profesor.js'
// import Disciplinas from '../Models/Disciplinas.js'

// class ControlRegistrarProfesor{
//     constructor(){}
//     handleDisciplinas = (req, res) => {
//         Disciplinas.obtenerDisciplinas((err, rows) => {
//             if (err) {
//                 return res.status(500).json({ error: err.message });
//             }

//             if (rows.length > 0) {
//                 // Extraer las disciplinas de la consulta
//                 const disciplinas = rows.map(row => row.nombre); // Asumiendo que "nombre" es el campo en la BD
//                 return res.status(200).json(disciplinas); // Enviar disciplinas como JSON
//             } else {
//                 return res.status(404).json({ message: "No se encontraron disciplinas." }); // Sin resultados
//             }
//         });
//     };
//     // Para obtener la ruta de interfaz segun el tipo de usuario
// }

// export default new ControlRegistrarProfesor();