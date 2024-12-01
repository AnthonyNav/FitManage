import { Router } from "express"
import ControlLogin from "../Controllers/ControlLogin.js";
import ControlRegistrarAlumno from "../Controllers/ControlRegistrarAlumno.js";
import ControlRegistrarProfesor from "../Controllers/ControlRegistrarProfesor.js";
import ControlActualizarAlumno from "../Controllers/ControlActualizarAlumno.js";

const router = Router();

router.get('/', (req, res) => res.render("index"));


router.get('/registrar-alumno', (req, res) => res.render("PantallaRegistrarAlumno"));
router.get('/registrar-estudiante', (req, res) => res.render("registroEstudiante"));
// router.get('/registrar-profesor', (req, res) => res.render("PantallaRegistrarProfesor"));
router.get('/actualizar-alumno', (req, res) => res.render("ActualizarAlumno"));
router.get('/actualizar-estudiante', (req, res) => res.render("ActualizarEstudiante"));
router.get("/registrar-profesor", (req, res) =>
    ControlRegistrarProfesor.renderPaginaRegistrarProfesor(req, res));

const estudiantes = [
    { id: 1, name: "Juan Pérez", email: "juan@gmail.com", phone: "1234567890" },
    { id: 2, name: "María López", email: "maria@gmail.com", phone: "0987654321" },
    { id: 3, name: "Carlos Martínez", email: "carlos@gmail.com", phone: "5678901234" },
    { id: 4, name: "Ana Rodríguez", email: "ana@gmail.com", phone: "2345678901" },
    { id: 5, name: "Luis García", email: "luis@gmail.com", phone: "6789012345" },
    { id: 6, name: "Sofía Hernández", email: "sofia@gmail.com", phone: "3456789012" },
    { id: 7, name: "Diego Sánchez", email: "diego@gmail.com", phone: "7890123456" },
    { id: 8, name: "Laura Díaz", email: "laura@gmail.com", phone: "4567890123" },
    { id: 9, name: "Miguel Torres", email: "miguel@gmail.com", phone: "8901234567" },
    { id: 10, name: "Elena Castro", email: "elena@gmail.com", phone: "5678901234" },
    { id: 11, name: "Ricardo Morales", email: "ricardo@gmail.com", phone: "9012345678" },
    { id: 12, name: "Marina Ruiz", email: "marina@gmail.com", phone: "6789012345" },
    { id: 13, name: "Javier Navarro", email: "javier@gmail.com", phone: "0123456789" },
    { id: 14, name: "Carmen Álvarez", email: "carmen@gmail.com", phone: "7890123456" },
    { id: 15, name: "Pedro Romero", email: "pedro@gmail.com", phone: "2345678901" },
    { id: 16, name: "Isabel Jiménez", email: "isabel@gmail.com", phone: "8901234567" },
    { id: 17, name: "Fernando Núñez", email: "fernando@gmail.com", phone: "3456789012" },
    { id: 18, name: "Beatriz Molina", email: "beatriz@gmail.com", phone: "9012345678" },
    { id: 19, name: "Antonio Moreno", email: "antonio@gmail.com", phone: "4567890123" },
    { id: 20, name: "Raquel Ortiz", email: "raquel@gmail.com", phone: "5678901234" }
];
router.get("/registrar-pago/seleccionar", (req, res) => res.render("PantallaSeleccionarEstudiantes",  { students: estudiantes }));

router.get('/administrador',
    (req, res) => {
        if (req.session.user && req.session.user.type_user == 'administrador') {
            res.render("administrador", {message: ""});
        } else {
            res.status(403).json({ error: "Acceso denegado. No tienes permisos para esta página." });
        }
    }
);

router.get('/profesor',
    (req, res) => {
        if (req.session.user && req.session.user.type_user == 'profesor') {
            res.render("profesor");
        } else {
            res.status(403).json({ error: "Acceso denegado. No tienes permisos para esta página." });
        }
    }
);

router.get('/alumno',
    (req, res) => {
        if (req.session.user && req.session.user.type_user == 'alumno') {
            res.render("alumno");
        } else {
            res.status(403).json({ error: "Acceso denegado. No tienes permisos para esta página." });
        }
    }
);

router.get('/login', (req, res) => res.render("login", { error: "" }));

router.post('/login', (req, res) => ControlLogin.handleLogin(req, res));

router.post('/registrar-alumno', (req, res) => ControlRegistrarAlumno.handleRegistrarAlumno(req, res));
router.post('/registrar-estudiante', (req, res) => ControlRegistrarAlumno.handleRegistrarEstudiante(req, res));

router.get('/registrar-profesor', (req, res) => ControlRegistrarProfesor.handleDisciplinas(req, res));
router.post('/registrar-profesor', (req, res) => ControlRegistrarProfesor.handleRegistrarProfesor(req, res));
router.get('/actualizar', (req, res) => ControlActualizarAlumno.renderPantallaActualizar(req, res));
router.post('/actualizar', (req, res) => ControlActualizarAlumno.handleSeleccionarAlumno(req, res));
router.post('/actualizar-alumno', (req, res) => ControlActualizarAlumno.handleActualizarAlumno(req, res));
router.post('/actualizar-estudiante', (req, res) => ControlActualizarAlumno.handleActualizarEstudiante(req, res));




export default router