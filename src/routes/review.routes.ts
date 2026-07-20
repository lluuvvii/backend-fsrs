import { Router } from "express";
import { getReviewLogById, getReviewLogs, getReviewLogsByCard, getReviewLogsByUser, reviewCard } from "../controllers/review.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", getReviewLogs);

router.get("/user/:userId", getReviewLogsByUser);

router.get("/card/:cardId", getReviewLogsByCard);

router.get("/:id", getReviewLogById);

router.post("/:id", reviewCard);

export default router;