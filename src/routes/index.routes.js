import { Router } from "express";
import reservaRoutes from "./reserva.routes.js";
import usuarioRoutes from "./usuario.routes.js";

const router = Router();

router.use("/reserva", reservaRoutes);
router.use("/usuario", usuarioRoutes);

export default router;
