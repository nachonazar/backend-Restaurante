class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // errores esperados (validación, not found, etc)
  }
}

export default AppError;