import { Router } from "express";
import reservaRoutes from "./reserva.routes.js";

const router = Router();

router.use("/reserva", reservaRoutes);

export default router;
