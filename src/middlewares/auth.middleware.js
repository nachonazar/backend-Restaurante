import jwt from "jsonwebtoken";
import AppError from "../shared/AppError.js";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Token no proporcionado", 401);
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = payload; // { id, role }

    next();
  } catch (error) {
    if (error instanceof AppError) return next(error);
    next(new AppError("Token inválido o expirado", 401));
  }
};