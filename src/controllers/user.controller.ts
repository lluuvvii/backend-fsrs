import { Request, Response } from "express";
import User from "../models/User";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const { username, email, password } =
      req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          "Username or email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Register success",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Register failed",
      error,
    });
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login success",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await User.find().select(
      "-password"
    );

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
    const user = await User.findById(
      req.params.id
    ).select("-password");

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

export const updateUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { username, email, password } =
      req.body;

    const updateData: any = {
      username,
      email,
    };

    if (password) {
      updateData.password =
        await bcrypt.hash(password, 10);
    }

    const user =
      await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
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
    const user =
      await User.findByIdAndDelete(
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