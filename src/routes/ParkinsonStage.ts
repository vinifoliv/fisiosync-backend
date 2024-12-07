import express from "express";
import { ParkinsonStage, ParkinsonStageProps } from "../repository/ParkinsonStage";
import { ErrorMessage, SendError, SuccessMessage } from "../messages";

export const parkinsonStage = express.Router();

parkinsonStage.post("/create-parkinson-stage", async (req, res) => {
  const data = req.body as ParkinsonStageProps;

  try {
    if (!data.id || !data.range) res.status(400).json(new ErrorMessage("The id or the range have not been sent."));

    const stage = new ParkinsonStage(data.id, data.range);
    const result = await stage.createStage();
    if (!result) throw new ErrorMessage("Server failed internally to create Parkinson stage.");
    res.status(200).json(new SuccessMessage(result));
  } catch (error: any) {
    res.status(500).send(SendError(error));
  }
});

parkinsonStage.get("/get-parkinson-stages", async (req, res) => {
  try {
    const result = await ParkinsonStage.getParkinsonStages();
    res.status(200).json(new SuccessMessage(result));
  } catch (error: any) {
    res.status(500).send(SendError(error));
  }
});
