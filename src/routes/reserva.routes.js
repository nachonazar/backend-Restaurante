import { Router } from "express";
import { test } from "../controllers/reserva.controllers.js";

const router = Router();
//get, post, put, delete
router.route("/test").get(test);

export default router;
