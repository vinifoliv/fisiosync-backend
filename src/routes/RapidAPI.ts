import express from "express";
import { ErrorMessage, SendError, SuccessMessage } from "../messages";

export const rapidapi = express.Router();

const fetch = require("node-fetch");

rapidapi.get("/convert-to-mp3", async (req, res) => {
  try {
    if (!req.query.url) throw new ErrorMessage("The url has not been sent.");

    const url = `https://youtube-to-mp315.p.rapidapi.com/download?url=${req.query.url}&format=mp3`;
    const options = {
      method: "POST",
      headers: {
        "x-rapidapi-key": "dc7b99f929mshc6b2f8ea4654a36p1bde5fjsnf67d774c7101",
        "x-rapidapi-host": "youtube-to-mp315.p.rapidapi.com",
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, options);
    const result = await response.json();

    res.status(200).json(new SuccessMessage({ url: result.downloadUrl }));
  } catch (error: any) {
    res.status(500).send(SendError(error));
  }
});
