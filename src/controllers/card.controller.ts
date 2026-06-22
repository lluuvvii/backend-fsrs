import { Request, Response } from "express";
import Card from "../models/Card";
import { createEmptyCard } from "ts-fsrs";

export const createCard = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, front, back } = req.body;

    const fsrsCard = createEmptyCard();

    const card = await Card.create({
      userId,
      front,
      back,
      ...fsrsCard,
    });

    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create card",
      error,
    });
  }
};

export const getCardById = async (
  req: Request,
  res: Response
) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get card",
      error,
    });
  }
};