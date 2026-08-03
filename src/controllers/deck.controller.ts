import { Request, Response } from "express";
import Deck from "../models/Deck";
import Card from "../models/Card";
import ReviewLog from "../models/ReviewLog";

export const getDecks = async (
  req: Request,
  res: Response
) => {
  try {
    const decks = await Deck.find();

    res.status(200).json(decks);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get decks",
      error,
    });
  }
};

export const getDecksByUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const decks = await Deck.find({
      userId,
    });

    res.status(200).json(decks);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get decks",
      error,
    });
  }
};

export const getDeckById = async (
  req: Request,
  res: Response
) => {
  try {
    const deck = await Deck.findById(
      req.params.id
    );

    if (!deck) {
      return res.status(404).json({
        message: "Deck not found",
      });
    }

    res.status(200).json(deck);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get deck",
      error,
    });
  }
};

export const createDeck = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, name, description } =
      req.body;

    if (!userId || !name) {
      return res.status(400).json({
        message: "User ID and deck name are required",
      });
    }

    if (name.trim().length === 0) {
      return res.status(400).json({
        message: "Deck name cannot be empty",
      });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({
        message:
          "Deck name must not exceed 100 characters",
      });
    }

    if (
      description &&
      description.length > 500
    ) {
      return res.status(400).json({
        message:
          "Description must not exceed 500 characters",
      });
    }

    const deck = await Deck.create({
      userId,
      name: name.trim(),
      description: description?.trim() || "",
    });

    res.status(201).json(deck);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create deck",
      error,
    });
  }
};

export const updateDeck = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, description } = req.body;

    const deck = await Deck.findById(
      req.params.id
    );

    if (!deck) {
      return res.status(404).json({
        message: "Deck not found",
      });
    }

    if (
      name !== undefined &&
      name.trim().length === 0
    ) {
      return res.status(400).json({
        message: "Deck name cannot be empty",
      });
    }

    if (
      name &&
      name.trim().length > 100
    ) {
      return res.status(400).json({
        message:
          "Deck name must not exceed 100 characters",
      });
    }

    if (
      description &&
      description.length > 500
    ) {
      return res.status(400).json({
        message:
          "Description must not exceed 500 characters",
      });
    }

    const updatedDeck =
      await Deck.findByIdAndUpdate(
        req.params.id,
        {
          ...(name && {
            name: name.trim(),
          }),
          ...(description !== undefined && {
            description:
              description.trim(),
          }),
        },
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json(updatedDeck);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update deck",
      error,
    });
  }
};

export const deleteDeck = async (
  req: Request,
  res: Response
) => {
  try {
    const deck =
      await Deck.findByIdAndDelete(
        req.params.id
      );

    if (!deck) {
      return res.status(404).json({
        message: "Deck not found",
      });
    }

    const cards = await Card.find({
      deckId: req.params.id,
    }).select("_id");

    await ReviewLog.deleteMany({
      cardId: {
        $in: cards.map((c) => c._id),
      },
    });

    await Card.deleteMany({
      deckId: req.params.id,
    });

    res.status(200).json({
      message: "Deck deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete deck",
      error,
    });
  }
};