import { Router } from "express"

const router = Router();

router.get('/', (req, res) => res.render("index"));

router.get('/administrador', (req, res) => res.render("administrador"));

router.get('/profesor', (req, res) => res.render("profesor"));

router.get('/alumno', (req, res) => res.render("alumno"));

router.get('/login', (req, res) => res.render("login"));

export default router