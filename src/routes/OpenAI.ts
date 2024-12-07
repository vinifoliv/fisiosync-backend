import express from "express";
import { AuthJWT } from "../middlewares";
import { User } from "../repository/User";

import { ErrorMessage, SendError, SuccessMessage } from "../messages";

export const openai = express.Router();

openai.get("/music-recommendations-byuser/:userId", async (req, res) => {
  try {
    if (!req.params.userId || !Number(req.params.userId)) res.status(400).send("The id has not been sent.");

    const user = User.getUserById(Number(req.params.userId));

    res.status(200).json(new SuccessMessage(user));
  } catch (error: any) {
    res.status(500).send(SendError(error));
  }
});
