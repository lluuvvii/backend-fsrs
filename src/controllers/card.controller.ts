import { Request, Response } from "express";
import Card from "../models/Card";
import { createEmptyCard } from "ts-fsrs";

export const getCards = async (
  req: Request,
  res: Response
) => {
  try {
    const cards = await Card.find();

    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get cards",
      error,
    });
  }
};

export const getCardsByUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;

    const cards = await Card.find({
      userId,
    });

    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get cards",
      error,
    });
  }
};

export const getDueCards = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;

    const cards = await Card.find({
      userId,
      due: {
        $lte: new Date(),
      },
    });

    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get due cards",
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

export const updateCard = async (
  req: Request,
  res: Response
) => {
  try {
    const { front, back } = req.body;

    const card = await Card.findByIdAndUpdate(
      req.params.id,
      {
        front,
        back,
      },
      {
        new: true,
      }
    );

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update card",
      error,
    });
  }
};

export const deleteCard = async (
  req: Request,
  res: Response
) => {
  try {
    const card = await Card.findByIdAndDelete(
      req.params.id
    );

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    res.status(200).json({
      message: "Card deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete card",
      error,
    });
  }
};