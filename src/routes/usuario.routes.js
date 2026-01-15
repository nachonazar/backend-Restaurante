import { Router } from "express";
import { prueba } from "../controllers/usuario.controllers.js";

const router = Router();
//get, post, put, delete
router.route("/prueba").get(prueba)

export default router
