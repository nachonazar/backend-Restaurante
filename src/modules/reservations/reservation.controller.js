import AppError from "../../shared/AppError.js";
import Reservation from "./reservation.model.js";
import User from "../users/user.model.js";
import {
  getReservations,
  getReservationsById,
  createReservation,
  updateReservation,
  deleteReservation,
  getAvailableSlots,
  getMyReservations,
  cancelReservation,
  updateReservationStatus,
  getStats,
  getTrend,
  getPeakHours,
} from "./reservation.service.js";

export const test = (req, res) => {
  res.status(200);
  res.send("Primera prueba desde el backend");
};

export const leerReservas = async (req, res, next) => {
  try {
    //1- Buscar todas las reservas en la BD
    const listaReservas = await getReservations(req.user.id, req.user.role);
    //2- enviar la respuesta al front
    res.status(200).json(listaReservas);
  } catch (error) {
    next(error);
  }
};

export const crearReserva = async (req, res, next) => {
  try {
    // Buscar el email del usuario logueado
    const user = await User.findById(req.user.id).select("email");

    const nuevaReserva = await createReservation({
      ...req.body,
      userId: req.user.id,
      email: user.email, // usa el email del usuario registrado
    });

    res
      .status(201)
      .json({ mensaje: "Reserva creada exitosamente", data: nuevaReserva });
  } catch (error) {
    next(error);
  }
};

export const leerReservaPorId = async (req, res, next) => {
  try {
    //1- obtener el parametro del request
    //2- pedir a mongoose que encuentre la reserva con tal id
    const reservaBuscada = await getReservationsById(req.params.id);
    //3-responder al front
    res.status(200).json(reservaBuscada);
  } catch (error) {
    next(error);
  }
};

export const borrarReservaPorId = async (req, res, next) => {
  try {
    //1- buscar la reserva por id y luego borrar
    const reserva = await getReservationsById(req.params.id);
    if (
      req.user.role !== "Admin" &&
      reserva.userId.toString() !== req.user.id
    ) {
      throw new AppError("No autorizado", 403);
    }
    await deleteReservation(req.params.id);
    //2-responder al front
    res.status(200).json({ mensaje: "Reserva borrada exitosamente" });
  } catch (error) {
    next(error);
  }
};

export const editarReservaPorId = async (req, res, next) => {
  try {
    const reserva = await getReservationsById(req.params.id);
    if (
      req.user.role !== "Admin" &&
      reserva.userId.toString() !== req.user.id
    ) {
      throw new AppError("No autorizado", 403);
    }
    const updated = await updateReservation(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const leerSlotsDisponibles = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date)
      return res.status(400).json({ message: "La fecha es requerida" });
    const slots = await getAvailableSlots(date);
    res.status(200).json(slots);
  } catch (error) {
    next(error);
  }
};

export const leerMisReservas = async (req, res, next) => {
  try {
    const reservas = await getMyReservations(req.user.id);
    res.status(200).json(reservas);
  } catch (error) {
    next(error);
  }
};

export const cancelarReserva = async (req, res, next) => {
  try {
    await cancelReservation(req.params.id, req.user.id, req.user.role);
    res.status(200).json({ mensaje: "Reserva cancelada exitosamente" });
  } catch (error) {
    next(error);
  }
};

export const actualizarEstadoReserva = async (req, res, next) => {
  try {
    await updateReservationStatus(req.params.id, req.body.status);
    res.status(200).json({ mensaje: "Estado actualizado exitosamente" });
  } catch (error) {
    next(error);
  }
};

export const obtenerEstadisticas = async (req, res, next) => {
  try {
    const stats = await getStats();
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

export const obtenerTendencia = async (req, res, next) => {
  try {
    // Tomamos el periodo de la URL (ej: ?period=month), por defecto será 'month'
    const period = req.query.period || "month";
    const trend = await getTrend(period);
    res.status(200).json(trend);
  } catch (error) {
    next(error);
  }
};

export const obtenerHorasPico = async (req, res, next) => {
  try {
    const peakHours = await getPeakHours();
    res.status(200).json(peakHours);
  } catch (error) {
    next(error);
  }
};
