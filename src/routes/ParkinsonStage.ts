import express from "express";
import {
  ParkinsonStage,
  ParkinsonStageProps,
} from "../repository/ParkinsonStage";

export const parkinsonStage = express.Router();

parkinsonStage.post("/create-parkinson-stage", async (req, res) => {
  const data = req.body as ParkinsonStageProps;

  try {
    if (!data.id || !data.range)
      res.status(400).send("The id or the range have not been sent.");

    const stage = new ParkinsonStage(data.id, data.range);
    const result = await stage.createStage();
    if (!result)
      throw new Error("Server failed internally to create Parkinson stage.");
    res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

parkinsonStage.get("/get-parkinson-stages", async (req, res) => {
  try {
    const result = await ParkinsonStage.getParkinsonStages();
    res.status(200).json(result);
  } catch (error) {
    const fError = error as Error;
    res.status(500).send(fError.message);
  }
});
