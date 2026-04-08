import { Router } from "express";
import {
  getAllUsers,
  getOneUser,
  updateOneUser,
  suspendOneUser,
  activateOneUser,
  deleteOneUser,
  getMe,
} from "./user.controller.js";
import { validateUpdateUser } from "./user.validator.js";
import { handleValidation } from "../../shared/handleValidation.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import { requireAdmin } from "../../middlewares/role.middleware.js";

const router = Router();

router.get("/me", verifyToken, getMe);
router.get("/", verifyToken, requireAdmin, getAllUsers);
router.get("/:id", verifyToken, requireAdmin, getOneUser);
router.put(
  "/:id",
  verifyToken,
  requireAdmin,
  validateUpdateUser,
  handleValidation,
  updateOneUser,
);
router.patch("/:id/suspend", verifyToken, requireAdmin, suspendOneUser);
router.patch("/:id/activate", verifyToken, requireAdmin, activateOneUser);
router.delete("/:id", verifyToken, requireAdmin, deleteOneUser);

export default router;
