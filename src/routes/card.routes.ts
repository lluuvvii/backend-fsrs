import { Router } from "express";
import { getCards, getCardsByUser, getDueCards, getCardById, createCard, updateCard, deleteCard } from "../controllers/card.controller";

const router = Router();

router.get("/", getCards);

router.get("/user/:userId", getCardsByUser);

router.get("/user/:userId/due", getDueCards);

router.get("/:id", getCardById);

router.post("/", createCard);

router.put("/:id", updateCard);

router.delete("/:id", deleteCard);

export default router;