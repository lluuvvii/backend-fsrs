import { Router } from "express";
import { reviewCard } from "../controllers/review.controller";

const router = Router();

router.post("/:id", reviewCard);

export default router;