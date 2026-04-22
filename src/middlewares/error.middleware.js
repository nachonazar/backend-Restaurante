import AppError from "../shared/AppError.js";

export const errorMiddleware = (error, req, res, next) => {
  // Error operacional — lo lanzamos con AppError
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  // Error de Mongoose — ID inválido
  if (error.name === "CastError") {
    return res.status(400).json({ message: "ID inválido" });
  }

  // Error de Mongoose — campo único duplicado (ej: email ya registrado)
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(409).json({
      message: `El ${field} ya está registrado`,
    });
  }

  // Error desconocido — no lo exponemos al cliente
  console.error("ERROR NO CONTROLADO:", error);
  return res.status(500).json({ message: "Error interno del servidor" });
};