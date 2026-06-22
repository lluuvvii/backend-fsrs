import { Request, Response } from "express";
import Card from "../models/Card";
import ReviewLog from "../models/ReviewLog";

import { fsrs, Grade, Rating } from "ts-fsrs";

const scheduler = fsrs();

export const reviewCard = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    const card = await Card.findById(id);

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    const result = scheduler.next(
      card.toObject(),
      new Date(),
      rating as Grade
    );

    await Card.findByIdAndUpdate(
      id,
      result.card
    );

    const reviewLog = await ReviewLog.create({
      cardId: card._id,
      userId: card.userId,

      ...result.log,
    });

    res.json({
      card: result.card,
      reviewLog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Review failed",
      error,
    });
  }
};