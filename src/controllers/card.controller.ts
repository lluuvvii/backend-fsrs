import { Request, Response } from "express";
import Card from "../models/Card";
import ReviewLog from "../models/ReviewLog";
import { createEmptyCard, fsrs, Grade } from "ts-fsrs";
import Deck from "../models/Deck";

const parseNow = (raw?: string): Date => {
  if (raw && !isNaN(Date.parse(raw))) {
    return new Date(raw);
  }
  return new Date();
};

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

    const deck = await Deck.findById(deckId);

    if (!deck) {
      return res.status(404).json({
        message: "Deck not found",
      });
    }

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

    const deck = await Deck.findById(deckId);

    if (!deck) {
      return res.status(404).json({
        message: "Deck not found",
      });
    }

    const cards = await Card.find({
      deckId,
      due: {
        $lte: parseNow(
          typeof req.query.now === "string"
            ? req.query.now
            : undefined
        ),
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

export const previewCard = async (
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

    const scheduler = fsrs();
    const preview = scheduler.repeat(
      card.toObject(),
      parseNow(
        typeof req.query.now === "string"
          ? req.query.now
          : undefined
      )
    );

    const result: Record<
      number,
      { due: Date; scheduled_days: number }
    > = {};

    (Object.keys(preview) as unknown as Grade[]).forEach(
      (rating) => {
        result[Number(rating)] = {
          due: preview[rating].card.due,
          scheduled_days:
            preview[rating].card.scheduled_days,
        };
      }
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Failed to preview card",
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

    if (!deckId || !front || !back) {
      return res.status(400).json({
        message:
          "Deck ID, front, and back are required",
      });
    }

    if (front.trim().length === 0) {
      return res.status(400).json({
        message: "Front cannot be empty",
      });
    }

    if (back.trim().length === 0) {
      return res.status(400).json({
        message: "Back cannot be empty",
      });
    }

    if (front.length > 1000) {
      return res.status(400).json({
        message:
          "Front must not exceed 1000 characters",
      });
    }

    if (back.length > 1000) {
      return res.status(400).json({
        message:
          "Back must not exceed 1000 characters",
      });
    }

    const deck = await Deck.findById(deckId);

    if (!deck) {
      return res.status(404).json({
        message: "Deck not found",
      });
    }

    const fsrsCard = createEmptyCard();

    const card = await Card.create({
      deckId,
      front: front.trim(),
      back: back.trim(),
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

    if (
      front === undefined &&
      back === undefined
    ) {
      return res.status(400).json({
        message:
          "Front or back must be provided",
      });
    }

    const card = await Card.findById(
      req.params.id
    );

    if (!card) {
      return res.status(404).json({
        message: "Card not found",
      });
    }

    const updateData: any = {};

    if (front !== undefined) {
      if (front.trim().length === 0) {
        return res.status(400).json({
          message: "Front cannot be empty",
        });
      }

      if (front.length > 1000) {
        return res.status(400).json({
          message:
            "Front must not exceed 1000 characters",
        });
      }

      updateData.front = front.trim();
    }

    if (back !== undefined) {
      if (back.trim().length === 0) {
        return res.status(400).json({
          message: "Back cannot be empty",
        });
      }

      if (back.length > 1000) {
        return res.status(400).json({
          message:
            "Back must not exceed 1000 characters",
        });
      }

      updateData.back = back.trim();
    }

    const updatedCard =
      await Card.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json(updatedCard);
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

    await ReviewLog.deleteMany({
      cardId: req.params.id,
    });

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