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
  leerSlotsDisponibles,
  leerMisReservas,
  cancelarReserva,
  actualizarEstadoReserva,
  obtenerEstadisticas,
  obtenerTendencia,
  obtenerHorasPico,
} from "./reservation.controller.js";

const router = Router();

// --- PÚBLICAS ---
router.get("/slots", leerSlotsDisponibles);

// --- ESTADÍSTICAS (ANTES DE /:id) ---
//arriba para que express las atrape antes de confundirlas con un ID
router.get("/stats", verifyToken, requireAdmin, obtenerEstadisticas);
router.get("/stats/trend", verifyToken, requireAdmin, obtenerTendencia);
router.get("/stats/peak-hours", verifyToken, requireAdmin, obtenerHorasPico);

// --- USUARIO AUTENTICADO ---
router.get("/my-reservations", verifyToken, leerMisReservas);
router.post(
  "/",
  verifyToken,
  validateCreateReservation,
  handleValidation,
  crearReserva,
);
router.patch("/:id/cancel", verifyToken, cancelarReserva);

// --- SOLO ADMIN ---
router.get("/", verifyToken, requireAdmin, leerReservas);
router.get("/:id", verifyToken, requireAdmin, leerReservaPorId);
router.put(
  "/:id",
  verifyToken,
  requireAdmin,
  validateUpdateReservation,
  handleValidation,
  editarReservaPorId,
);
router.patch("/:id", verifyToken, requireAdmin, actualizarEstadoReserva);
router.delete("/:id", verifyToken, requireAdmin, borrarReservaPorId);

export default router;
