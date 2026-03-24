import Reservation from "./reservation.model.js";
import AppError from "../../shared/AppError.js";

export const verificarDisponibilidad = async (date, time, excludeId = null) => {
  const query = { date, time };
  if (excludeId) query._id = { $ne: excludeId };
  const existe = await Reservation.findOne(query);
  if (existe)
    throw new AppError("Ya existe una reserva para esa fecha y hora", 409);
};

export const getReservations = async (userId, role) => {
  const query = role === "Admin" ? {} : userId;
  return await Reservation.find(query);
};

export const getReservationsById = async (id) => {
  const reserva = await Reservation.findById(id);
  if (!reserva) throw new AppError("Reserva no encontrada", 404);
  return reserva;
};

export const createReservation = async (data) => {
  await verificarDisponibilidad(data.date, data.time);
  const reserva = new Reservation(data);
  return await reserva.save();
};

export const updateReservation = async (id, data) => {
  await verificarDisponibilidad(data.date, data.time, id);
  const reserva = await Reservation.findByIdAndUpdate(id, data, { new: true });
  if (!reserva) throw new AppError("Reserva no encontrada", 404);
  return reserva;
};

export const deleteReservation = async (id) => {
  const reserva = await Reservation.findByIdAndDelete(id);
  if (!reserva) throw new AppError("Reserva no encontrada", 404);
  return true;
};
