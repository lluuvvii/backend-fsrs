import { Request, Response } from "express";
import Deck from "../models/Deck";

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
    const decks = await Deck.find({
      userId: req.params.userId,
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

    const deck = await Deck.create({
      userId,
      name,
      description,
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
    const deck =
      await Deck.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!deck) {
      return res.status(404).json({
        message: "Deck not found",
      });
    }

    res.status(200).json(deck);
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