import { Router } from "express";
import { register, login } from "./auth.controller.js";
import { validateRegister, validateLogin } from "./auth.validator.js";
import { handleValidation } from "../../shared/handleValidation.js";

const router = Router();

router.post("/register", validateRegister, handleValidation, register);
router.post("/login", validateLogin, handleValidation, login);

export default router;