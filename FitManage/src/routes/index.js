import { Router } from "express"
import ControlLogin from "../Controllers/ControlLogin.js";
import ControlRegistrarAlumno from "../Controllers/ControlRegistrarAlumno.js";
import ControlRegistrarProfesor from "../Controllers/ControlRegistrarProfesor.js";
import ControlActualizarAlumno from "../Controllers/ControlActualizarAlumno.js";
import ControlRegistrarPago from "../Controllers/ControlRegistrarPago.js";
import ControlCrearClase from "../Controllers/ControlCrearClase.js";
import ControlVerificarVigenciaPaquete from "../Controllers/ControlVerificarVigenciaPaquete.js"; 
import ControlGraficasDeAlumnos from "../Controllers/ControlGraficasDeAlumnos.js";
import ControlNotificarProfesor from "../Controllers/ControlNotificarProfesor.js";
import ControlActualizarEstatus from "../Controllers/ControlActualizarEstatus.js"
import ControlReservarClase from "../Controllers/ControlReservarClase.js";
import ControlConsultarHorarioClasesProfesor from "../Controllers/ControlConsultarHorarioClasesProfesor.js";
const router = Router();

router.get('/', (req, res) => res.render("login", {error: ""}));
router.post('/', (req, res) =>  ControlLogin.handleLogin(req, res));
router.get('/administrador', (req, res) => res.render("PantallaPrincipalAdministrador"));
router.get('/alumno', (req, res) => res.render("PantallaPrincipalAlumno"));
router.get('/profesor', (req, res) => res.render("PantallaPrincipalProfesor"));





router.get('/registrar-alumno', (req, res) => res.render("PantallaRegistrarAlumno"));


router.get('/registrar-alumno', (req, res) => res.render("PantallaRegistrarAlumno"));
router.get('/registrar-estudiante', (req, res) => res.render("registroEstudiante"));
router.get('/registrar-profesionista', (req, res) => res.render("RegistroProfesionista"));
router.get('/actualizar-profesionista', (req, res) => res.render("ActualizarRegistroProfesionista"));
// router.get('/registrar-profesor', (req, res) => res.render("PantallaRegistrarProfesor"));
router.get('/actualizar-alumno', (req, res) => res.render("ActualizarAlumno"));
router.get('/actualizar-estudiante', (req, res) => res.render("ActualizarEstudiante"));
router.get("/registrar-profesor", (req, res) => ControlRegistrarProfesor.renderPaginaRegistrarProfesor(req, res));

router.get("/registrar-pago/", (req, res) => ControlRegistrarPago.handleObtenerAlumnos(req, res));
router.post("/registrar-pago/pago", (req, res) => ControlRegistrarPago.handleRegistrarPago(req, res));
router.post("/registrar-pago/", (req, res) => ControlRegistrarPago.handleObtenerPaquetes(req, res));
router.get('/graficas-alumnos', (req, res) => ControlGraficasDeAlumnos.renderGraficoDefault(req, res)); 
router.post('/graficas-alumnos', (req, res) => ControlGraficasDeAlumnos.obtenerDatos(req, res));
router.get('/notificar-cumple', (req, res) => ControlNotificarProfesor.handleGetBirthdayStudents(req, res));
router.post('/notificar-cumple', (req, res) => ControlNotificarProfesor.handleEditarMensaje(req, res));
router.get('/notificar-cumple/mensaje', (req, res) => ControlNotificarProfesor.handleEditarMensaje(req, res));

router.post('/notificar-cumple/mensaje', (req, res) => ControlNotificarProfesor.handleNotificarProfesor(req, res));

router.get("/verificar-vigencia/",
    (req, res) => {
        if (req.session.user && req.session.user.type_user == 'alumno') {
            ControlVerificarVigenciaPaquete.handleObtenerVigencia(req, res);
        } else {
            res.render("login", { error: "Acceso denegado. No tienes permisos para esta página." });
        }
    }
);

router.get('/administrador',
    (req, res) => {
        if (req.session.user && req.session.user.type_user == 'administrador') {
            res.render("PantallaPrincipalAdministrador", {message: ""});
        } else {
            res.render("login", { error: "Acceso denegado. No tienes permisos para esta página." });
        }
    }
);

router.get('/profesor',
    (req, res) => {
        if (req.session.user && req.session.user.type_user == 'profesor') {
            res.render("PantallaPrincipalProfesor");
        } else {
            res.render("login", { error: "Acceso denegado. No tienes permisos para esta página." });
        }
    }
);

router.get('/alumno',
    (req, res) => {
        if (req.session.user && req.session.user.type_user == 'alumno') {
            res.render("PantallaPrincipalAlumno", {message: ""});
        } else {
            res.render("login", { error: "Acceso denegado. No tienes permisos para esta página." });
        }
    }
);



//router.get('/', (req, res) => res.render("login", { error: "" }));
//router.post('/', (req, res) => ControlLogin.handleLogin(req, res));

router.post('/registrar-alumno', (req, res) => ControlRegistrarAlumno.handleRegistrarAlumno(req, res));
router.post('/registrar-estudiante', (req, res) => ControlRegistrarAlumno.handleRegistrarEstudiante(req, res));
router.post('/registrar-profesionista', (req, res) => ControlRegistrarAlumno.handleRegistrarProfesionista(req, res));


router.get('/registrar-profesor', (req, res) => ControlRegistrarProfesor.handleDisciplinas(req, res));
router.post('/registrar-profesor', (req, res) => ControlRegistrarProfesor.handleRegistrarProfesor(req, res));
router.get('/actualizar', (req, res) => ControlActualizarAlumno.renderPantallaActualizar(req, res));
router.post('/actualizar', (req, res) => ControlActualizarAlumno.handleSeleccionarAlumno(req, res));
router.post('/actualizar-alumno', (req, res) => ControlActualizarAlumno.handleActualizarAlumno(req, res));
router.post('/actualizar-estudiante', (req, res) => ControlActualizarAlumno.handleActualizarEstudiante(req, res));

router.post('/actualizar-profesionista', (req, res) => ControlActualizarAlumno.handleActualizarProfesionista(req, res));

router.get('/crear-clase', (req, res) => ControlCrearClase.renderPantallaCrearClase(req, res));
router.post('/crear-clase', (req, res) => ControlCrearClase.handleCrearClase(req, res));



//?? pruebas


router.get('/actualizar-estatus-usuario', (req, res) => ControlActualizarEstatus.renderPantallaActualizarEstatus(req, res));

router.post('/actualizar-estatus-usuario', (req, res) => ControlActualizarEstatus.handleActualizarEstatus(req, res));
//??

router.get('/reservar-clase', (req, res) => ControlReservarClase.renderPantallaReservarClase(req, res));
router.post('/reservar-clase', (req, res) => ControlReservarClase.handleReservarClase(req, res));


router.get('/horario-profesor', (req, res) => ControlConsultarHorarioClasesProfesor.renderPantallaHorarioProfesor(req, res));

export default router