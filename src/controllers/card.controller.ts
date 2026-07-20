import { Request, Response } from "express";
import Card from "../models/Card";
import { createEmptyCard } from "ts-fsrs";
import Deck from "../models/Deck";

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

export const getCardsByDeck = async (
  req: Request,
  res: Response
) => {
  try {
    const { deckId } = req.params;

    const cards = await Card.find({
      deckId,
    });

    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get cards",
      error,
    });
  }
};

export const getDueCardsByDeck = async (
  req: Request,
  res: Response
) => {
  try {
    const { deckId } = req.params;

    const cards = await Card.find({
      deckId,
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
    const { deckId, front, back } = req.body;

    const deck = await Deck.findById(deckId);

    if (!deck) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    const fsrsCard = createEmptyCard();

    const card = await Card.create({
      deckId,
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
        runValidators: true,
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