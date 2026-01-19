import { Router } from "express";
import {
  borrarReservaPorId,
  crearReserva,
  editarReservaPorId,
  leerReservaPorId,
  leerReservas,
  test,
} from "../controllers/reserva.controllers.js";
import validacionReserva from "../../middlewares/validarReserva.js";

const router = Router();
//get, post, put, delete
router.route("/test").get(test);
router.route("/").get(leerReservas).post(validacionReserva, crearReserva);
router
  .route("/:id")
  .get(leerReservaPorId)
  .delete(borrarReservaPorId)
  .put(validacionReserva, editarReservaPorId);

export default router;
