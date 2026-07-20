import { Router } from "express";
import { getCards, getCardsByDeck, getDueCardsByDeck, getCardById, createCard, updateCard, deleteCard } from "../controllers/card.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", getCards);

router.get("/deck/:deckId/due", getDueCardsByDeck);

router.get("/deck/:deckId", getCardsByDeck);

router.get("/:id", getCardById);

router.post("/", createCard);

router.put("/:id", updateCard);

router.delete("/:id", deleteCard);

export default router;