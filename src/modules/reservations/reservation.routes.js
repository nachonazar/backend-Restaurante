import { Router } from "express";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import { requireAdmin } from "../../middlewares/role.middleware.js";
import { handleValidation } from "../../shared/handleValidation.js";
import {
  validateCreateReservation,
  validateUpdateReservation,
} from "./reservation.validator.js";
import {
  leerReservas,
  crearReserva,
  leerReservaPorId,
  editarReservaPorId,
  borrarReservaPorId,
} from "./reservation.controller.js";

const router = Router();

router
  .route("/")
  .get(verifyToken, leerReservas)
  .post(verifyToken, validateCreateReservation, handleValidation, crearReserva);

router
  .route("/:id")
  .get(verifyToken, leerReservaPorId)
  .delete(verifyToken, borrarReservaPorId)
  .put(
    verifyToken,
    validateUpdateReservation,
    handleValidation,
    editarReservaPorId,
  );

export default router;
