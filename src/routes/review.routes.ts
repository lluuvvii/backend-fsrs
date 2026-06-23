import { Router } from "express";
import { getReviewLogById, getReviewLogs, getReviewLogsByCard, getReviewLogsByUser, reviewCard } from "../controllers/review.controller";

const router = Router();

router.get("/", getReviewLogs);

router.get("/:id", getReviewLogById);

router.get("/user/:userId", getReviewLogsByUser);

router.get("/card/:cardId", getReviewLogsByCard);

router.post("/:id", reviewCard);

export default router;