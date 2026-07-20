import { Router } from "express";
import {
  register,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/", authenticate, getUsers);

router.get("/:id", authenticate, getUserById);

router.put("/:id", authenticate, updateUser);

router.delete("/:id", authenticate, deleteUser);

export default router;