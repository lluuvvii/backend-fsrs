import { Request, Response } from "express";
import Card from "../models/Card";
import ReviewLog from "../models/ReviewLog";

import { fsrs, Grade } from "ts-fsrs";

const scheduler = fsrs();

export const reviewCard = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (![1, 2, 3, 4].includes(Number(rating))) {
      return res.status(400).json({
        message: "Rating must be 1, 2, 3, or 4",
      });
    }

    const card = await Card.findById(id);

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    const result = scheduler.next(
      card.toObject(),
      new Date(), // simulation test part, ex: "2026-06-30T07:38:07.481Z"
      Number(rating) as Grade
    );

    Object.assign(card, result.card);

    await card.save();

    const reviewLog = await ReviewLog.create({
      cardId: card._id,
      userId: card.userId,
      ...result.log,
    });

    res.status(200).json({
      card,
      reviewLog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Review failed",
      error,
    });
  }
};