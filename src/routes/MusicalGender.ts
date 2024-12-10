import express from "express";
import { MusicalGender } from "../repository/MusicalGender";
import { ErrorMessage, SendError, SuccessMessage } from "../messages";
import { AuthJWT } from "../middlewares";

export const musicalGenders = express.Router();

musicalGenders.post("/create-musical-gender", AuthJWT, async (req, res) => {
  const data = req.body as { name: string[] };

  try {
    if (!data.name || !data.name.length) res.status(400).json(new ErrorMessage("The name has not been sent."));

    const newGenders = [];

    for (const name of data.name) {
      const gender = new MusicalGender(name);
      const genders = await MusicalGender.getMusicalGenders();
      if (genders) {
        for (const existingGender of genders) {
          if (existingGender.name === gender.name) {
            res.status(400).json(new SuccessMessage(`Musical gender '${gender.name}' already exists.`));
          }
        }
      }
      const result = await gender.createMusicalGender();
      if (!result) throw new ErrorMessage("Server failed internally to create musical gender.");

      newGenders.push(result);
    }
    res.status(201).json(new SuccessMessage(newGenders));
  } catch (error: any) {
    res.status(500).send(SendError(error));
  }
});

musicalGenders.get("/get-musical-genders", async (req, res) => {
  try {
    const result = await MusicalGender.getMusicalGenders();
    res.status(200).json(new SuccessMessage(result));
  } catch (error: any) {
    res.status(500).send(SendError(error));
  }
});
