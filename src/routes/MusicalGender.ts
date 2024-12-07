import express from "express";
import { MusicalGender } from "../repository/MusicalGender";

export const musicalGenders = express.Router();

musicalGenders.post("/create-musical-gender", async (req, res) => {
  const data = req.body as { name: string };

  try {
    if (!data.name) res.status(400).send("The name has not been sent.");

    const gender = new MusicalGender(data.name);
    const genders = await MusicalGender.getMusicalGenders();
    if (genders) {
      for (const existingGender of genders) {
        if (existingGender.name === gender.name) {
          res.status(400).send(`Musical gender '${gender.name}' already exists.`);
        }
      }
    }
    const result = await gender.createMusicalGender();
    if (!result) throw new Error("Server failed internally to create musical gender.");
    res.status(201).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

musicalGenders.get("/get-musical-genders", async (req, res) => {
  try {
    const result = await MusicalGender.getMusicalGenders();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
});
