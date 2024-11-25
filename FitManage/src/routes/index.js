import { Router } from "express"
import ControlLogin from "../Controllers/ControlLogin.js";

const router = Router();

router.get('/', (req, res) => res.render("index"));

router.get('/administrador', 
    (req, res) => {
        if (req.session.user && req.session.user.type_user == 'administrador') {
            res.render("administrador");
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

router.get('/login', (req, res) => res.render("login"));

router.post('/login', (req, res) => ControlLogin.handleLogin(req, res));

export default router