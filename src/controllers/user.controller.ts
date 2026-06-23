import { Request, Response } from "express";
import User from "../models/User";

export const getUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get users",
      error,
    });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get user",
      error,
    });
  }
};

export const createUser = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create user",
      error,
    });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        username,
        password,
        email,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user",
      error,
    });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await User.findByIdAndDelete(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
      error,
    });
  }
};