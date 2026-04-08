import express from "express";
import cors from "cors";
import morgan from "morgan";

// Rutas
import authRoutes from "./src/modules/auth/auth.routes.js";
import userRoutes from "./src/modules/users/user.routes.js";
import reservationRoutes from "./src/modules/reservations/reservation.routes.js";

// Middleware de errores
import { errorMiddleware } from "./src/middlewares/error.middleware.js";

const app = express();

const origenesPermitidos = [
  "http://localhost:5173", //localmente
  "https://restaurant-front-topaz-iota.vercel.app", //frontend en Vercel
];

app.use(
  cors({
    origin: origenesPermitidos,
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reservations", reservationRoutes);

// Manejo global de errores — siempre al final
app.use(errorMiddleware);

export default app;
