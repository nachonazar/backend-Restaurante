import Reservation from "./reservation.model.js";
import AppError from "../../shared/AppError.js";
import { HORAS_DISPONIBLES } from "../../shared/scheduleConfig.js";

export const verificarDisponibilidad = async (date, time, excludeId = null) => {
  const query = { date: new Date(date), time };
  if (excludeId) query._id = { $ne: excludeId };
  const existe = await Reservation.findOne(query);
  if (existe)
    throw new AppError("Ya existe una reserva para esa fecha y hora", 409);
};

export const getReservations = async (userId, role) => {
  const query = role === "Admin" ? {} : { userId };
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
  if (data.date && data.time) {
    await verificarDisponibilidad(data.date, data.time, id);
  }
  const reserva = await Reservation.findByIdAndUpdate(id, data, { new: true });
  if (!reserva) throw new AppError("Reserva no encontrada", 404);
  return reserva;
};

export const deleteReservation = async (id) => {
  const reserva = await Reservation.findByIdAndDelete(id);
  if (!reserva) throw new AppError("Reserva no encontrada", 404);
  return true;
};

export const getAvailableSlots = async (date) => {
  const reservasDelDia = await Reservation.find({
    date: new Date(date),
    status: { $ne: "Cancelada" },
  });

  const ocupados = reservasDelDia.map((r) => r.time);

  return {
    almuerzo: HORAS_DISPONIBLES.almuerzo.filter((h) => !ocupados.includes(h)),
    cena: HORAS_DISPONIBLES.cena.filter((h) => !ocupados.includes(h)),
  };
};

export const getMyReservations = async (userId) => {
  return await Reservation.find({ userId });
};

export const cancelReservation = async (id, userId, role) => {
  const reserva = await Reservation.findById(id);
  if (!reserva) throw new AppError("Reserva no encontrada", 404);
  if (role !== "Admin" && reserva.userId.toString() !== userId)
    throw new AppError("No autorizado", 403);
  reserva.status = "Cancelada";
  return await reserva.save();
};

export const updateReservationStatus = async (id, status) => {
  const reserva = await Reservation.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  );
  if (!reserva) throw new AppError("Reserva no encontrada", 404);
  return reserva;
};

export const getStats = async () => {
  const [total, confirmed, pending, canceled] = await Promise.all([
    Reservation.countDocuments(),
    Reservation.countDocuments({ status: "Confirmada" }),
    Reservation.countDocuments({ status: "Pendiente" }),
    Reservation.countDocuments({ status: "Cancelada" }),
  ]);

  return { total, confirmed, pending, canceled };
};

export const getTrend = async (period) => {
  let groupBy;

  if (period === "day") {
    groupBy = { $hour: "$date" };
  } else if (period === "month") {
    groupBy = { $week: "$date" };
  } else {
    groupBy = { $month: "$date" };
  }

  return await Reservation.aggregate([
    { $group: { _id: groupBy, value: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { name: "$_id", value: 1, _id: 0 } },
  ]);
};

export const getPeakHours = async () => {
  return await Reservation.aggregate([
    { $group: { _id: "$time", total: { $sum: 1 } } },
    { $sort: { total: -1 } },
    { $project: { hour: "$_id", total: 1, _id: 0 } },
  ]);
};
