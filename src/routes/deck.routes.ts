import { Router } from "express";
import { createDeck, deleteDeck, getDeckById, getDecks, getDecksByUser, updateDeck } from "../controllers/deck.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", getDecks);

router.get("/user/:userId", getDecksByUser);

router.get("/:id", getDeckById);

router.post("/", createDeck);

router.put("/:id", updateDeck);

router.delete("/:id", deleteDeck);

export default router;