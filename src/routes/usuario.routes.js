import { Router } from "express";
import { borrarUsuariosPorId, crearUsuario, editarUsuariosPorId, leerUsuarios, leerUsuariosPorId, prueba } from "../controllers/usuario.controllers.js";
import validacionUsuario from "../../middlewares/validarUsuario.js";

const router = Router();
//get, post, put, delete
router.route("/prueba").get(prueba);
router.route("/").get(leerUsuarios).post(validacionUsuario, crearUsuario)
router.route("/:id").get(leerUsuariosPorId).delete(borrarUsuariosPorId).put(validacionUsuario, editarUsuariosPorId)

export default router;
