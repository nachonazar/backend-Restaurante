import { body } from "express-validator";

export const validateCreateReservation = [
  body("clientName")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 3, max: 100 })
    .withMessage("Entre 3 y 100 caracteres"),

  body("email").optional().isEmail().withMessage("Email inválido"),

  body("date")
    .notEmpty()
    .withMessage("La fecha es obligatoria")
    .isDate()
    .withMessage("Formato de fecha inválido"),

  body("time")
    .notEmpty()
    .withMessage("La hora es obligatoria")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Formato HH:MM inválido"),

  body("pax")
    .notEmpty()
    .withMessage("La cantidad de personas es obligatoria")
    .isInt({ min: 1, max: 20 })
    .withMessage("Entre 1 y 20 personas"),
];

export const validateUpdateReservation = [
  body("clientName")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Entre 3 y 100 caracteres"),

  body("email").optional().isEmail().withMessage("Email inválido"),

  body("date").optional().isDate().withMessage("Formato de fecha inválido"),

  body("time")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Formato HH:MM inválido"),

  body("pax")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Entre 1 y 20 personas"),

  body("status")
    .optional()
    .isIn(["Pendiente", "Confirmada", "Cancelada"])
    .withMessage("Estado inválido"),
];
