import { Router } from "express"
import handleLogin from "../Controllers/ControlLogin.js";

const router = Router();

router.get('/', (req, res) => res.render("index"));

router.get('/administrador', (req, res) => res.render("administrador"));

router.get('/profesor', (req, res) => res.render("profesor"));

router.get('/alumno', (req, res) => res.render("alumno"));

router.get('/login', (req, res) => res.render("login"));

router.post('/login', handleLogin);

export default router