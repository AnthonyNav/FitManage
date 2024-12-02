import { Router } from "express"
import ControlLogin from "../Controllers/ControlLogin.js";
import ControlRegistrarAlumno from "../Controllers/ControlRegistrarAlumno.js";
import ControlRegistrarProfesor from "../Controllers/ControlRegistrarProfesor.js";
import ControlActualizarAlumno from "../Controllers/ControlActualizarAlumno.js";
import ControlRegistrarPago from "../Controllers/ControlRegistrarPago.js";
import ControlCrearClase from "../Controllers/ControlCrearClase.js";
const router = Router();

router.get('/', (req, res) => res.render("index"));


router.get('/registrar-alumno', (req, res) => res.render("PantallaRegistrarAlumno"));
router.get('/registrar-estudiante', (req, res) => res.render("registroEstudiante"));
// router.get('/registrar-profesor', (req, res) => res.render("PantallaRegistrarProfesor"));
router.get('/actualizar-alumno', (req, res) => res.render("ActualizarAlumno"));
router.get('/actualizar-estudiante', (req, res) => res.render("ActualizarEstudiante"));
router.get("/registrar-profesor", (req, res) => ControlRegistrarProfesor.renderPaginaRegistrarProfesor(req, res));

router.get("/registrar-pago/", (req, res) => ControlRegistrarPago.handleObtenerAlumnos(req, res));
router.post("/registrar-pago/pago", (req, res) => ControlRegistrarPago.handleRegistrarPago(req, res));
router.post("/registrar-pago/", (req, res) => ControlRegistrarPago.handleObtenerPaquetes(req, res));

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


router.get('/crear-clase', (req, res) => ControlCrearClase.renderPantallaCrearClase(req, res));
router.post('/crear-clase', (req, res) => ControlCrearClase.handleCrearClase(req, res));


export default router