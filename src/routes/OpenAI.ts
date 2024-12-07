import express from "express";
import { AuthJWT } from "../middlewares";

export const openai = express.Router();

openai.post("/music-recommendations-byuser", AuthJWT, async (req, res) => {
  try {
  } catch (error) {
    res.status(500).send(error);
  }
});
