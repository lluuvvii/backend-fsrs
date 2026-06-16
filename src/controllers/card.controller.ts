import { Request, Response } from "express";
import Card from "../models/Card";

export const createCard = async (
  req: Request,
  res: Response
) => {
  try {
    const card = await Card.create(req.body);

    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create card",
      error,
    });
  }
};