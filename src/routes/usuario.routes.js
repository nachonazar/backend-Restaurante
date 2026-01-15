import { Router } from "express";
import { crearUsuario, leerUsuarios, prueba } from "../controllers/usuario.controllers.js";

const router = Router();
//get, post, put, delete
router.route("/prueba").get(prueba);
router.route("/").get(leerUsuarios).post(crearUsuario)

export default router;
