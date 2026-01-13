import { Router } from "express";
import { borrarReservaPorId, crearReserva, leerReservaPorId, leerReservas, test } from "../controllers/reserva.controllers.js";

const router = Router();
//get, post, put, delete
router.route("/test").get(test);
router.route("/").get(leerReservas).post(crearReserva)
router.route("/:id").get(leerReservaPorId).delete(borrarReservaPorId)

export default router;
