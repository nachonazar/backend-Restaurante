import AppError from "../shared/AppError.js";

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return next(new AppError("Acceso denegado. Se requiere rol Admin", 403));
  }
  next();
};