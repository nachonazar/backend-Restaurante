import { body } from "express-validator";

export const validateCreateUser = [
  body("userName")
    .trim()
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio")
    .isLength({ min: 3, max: 100 })
    .withMessage("Entre 3 y 100 caracteres")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)
    .withMessage("Solo puede contener letras"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("Email inválido"),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 8 })
    .withMessage("Mínimo 8 caracteres")
    .matches(/^(?=(?:.*\d){2,})(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}).*$/)
    .withMessage(
      "Mínimo 8 caracteres, 1 mayúscula, 2 números y 1 carácter especial",
    ),

  body("role").optional().isIn(["User", "Admin"]).withMessage("Rol inválido"),
];

export const validateUpdateUser = [
  body("userName")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Entre 3 y 100 caracteres")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/)
    .withMessage("Solo puede contener letras"),

  body("email").optional().trim().isEmail().withMessage("Email inválido"),

  body("role").optional().isIn(["User", "Admin"]).withMessage("Rol inválido"),
];
