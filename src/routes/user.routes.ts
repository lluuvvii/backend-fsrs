import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
} from "../controllers/user.controller";

const router = Router();

router.get("/", getUsers);

router.get("/:id", getUserById);

router.post("/", createUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;