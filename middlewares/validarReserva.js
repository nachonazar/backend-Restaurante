import { body } from "express-validator";
import Reserva from "../src/models/reserva.js";
import resultadoValidacion from "./resultadoValidacion.js";

const validacionReserva = [
  body("nombreCompleto")
    .notEmpty()
    .withMessage("El nombre del usuario es obligatorio")
    .isLength({ min: 3, max: 100 })
    .withMessage("El nombre del usuario debe tener entre 3 y 100 caracteres"),
  body("email")
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage("El email debe tener un formato válido"),
  body("fecha")
    .notEmpty()
    .withMessage("La fecha es obligatoria")
    .isISO8601()
    .withMessage("La fecha debe tener un formato válido"),
  body("hora")
    .notEmpty()
    .withMessage("La hora es obligatoria")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("La hora debe tener formato HH:mm")
    .custom(async (valor, { req }) => {
      const { fecha } = req.body;
      const reservaExistente = await Reserva.findOne({
        fecha: new Date(fecha),
        hora: valor,
        estado: { $ne: "Cancelada" },
      });
      // no existe ninguna reserva con esa fecha y hora
      if (!reservaExistente) return true;
      // verificar si es un PUT y es la misma reserva que estoy editando
      if (req.params?.id && reservaExistente._id.toString() === req.params.id) {
        return true;
      }
      throw new Error("Ya existe una reserva para esa fecha y horario");
    }),
  body("personas")
    .notEmpty()
    .withMessage("La cantidad de comensales es obligarorio")
    .isInt({ min: 1, max: 20 })
    .withMessage("La cantidad de comensales debe ser entre 1 y 20"),
  body("estado")
    .optional()
    .isIn(["Pendiente", "Confirmada", "Cancelada"])
    .withMessage(
      "El estado debe ser una de las siguientes opciones: Pendiente, Confirmada, Cancelada"
    ),
  (req, res, next) => resultadoValidacion(req, res, next),
];

export default validacionReserva;
