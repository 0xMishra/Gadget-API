import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(400).json({ message: "you are not logged in" });
      return;
    }

    const decoded = jwt.verify(token!, process.env.JWT_SECRET!);
    if (!decoded) {
      res.status(400).json({ message: "error signing in, invalid token" });
      return;
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
}
