import { Router } from "express";
import { createCard } from "../controllers/card.controller";
import { getCardById } from "../controllers/review.controller";

const router = Router();

router.post("/", createCard);
router.get("/:id", getCardById);

export default router;