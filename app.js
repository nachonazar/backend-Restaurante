import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import authRoutes from "./src/modules/auth/auth.routes.js";
import userRoutes from "./src/modules/users/user.routes.js";
import reservationRoutes from "./src/modules/reservations/reservation.routes.js";
import { errorMiddleware } from "./src/middlewares/error.middleware.js";

const app = express();

const origenesPermitidos = [
  "http://localhost:5173",
  "https://restaurant-front-topaz-iota.vercel.app",
];

app.use(cors({ origin: origenesPermitidos, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// Middleware que conecta a MongoDB antes de cada request
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reservations", reservationRoutes);

app.use(errorMiddleware);

export default app;