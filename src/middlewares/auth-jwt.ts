import { NextFunction, Request, Response } from "express";
const jwt = require("jsonwebtoken");

export const AuthJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const secret_key = process.env.JWT_SECRET_KEY;
    jwt.verify(token, secret_key);
    next();
  } catch (error) {
    res.status(403).json(new Error("Autenticação bloqueada!"));
  }
};
