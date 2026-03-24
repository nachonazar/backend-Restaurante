import AppError from "../../shared/AppError.js";
import Reservation from "./reservation.model.js";
import {
  getReservations,
  getReservationsById,
  createReservation,
  updateReservation,
  deleteReservation,
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
    //1- recibir el objeto que tengo que agregar a la BD
    //2- validar los datos del objeto
    //3- guardar el objeto en la BD
    const nuevaReserva = await createReservation({
      ...req.body,
      userId: req.user.id,
    });
    //4- enviar respuesta
    res.status(201).json({ mensaje: "Reserva creada exitosamente" });
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
    const reservaEliminada = await getReservationsById(req.params.id);
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
    //1- buscar la reserva por id y luego editar
    const reservaModificada = await getReservationsById(req.params.id);
    if (
      req.user.role !== "Admin" &&
      reserva.userId.toString() !== req.user.id
    ) {
      throw new AppError("No autorizado", 403);
    }
    await updateReservation(req.params.id, req.body);
    //2- responder al front
    res.status(200).json({ mensaje: "Reserva actualizada exitosamente" });
  } catch (error) {
    next(error);
  }
};
