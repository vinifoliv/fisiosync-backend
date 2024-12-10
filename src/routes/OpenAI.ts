import express from "express";
import OpenAI from "openai";

import { User } from "../repository/User";
import { UserMusicalGender } from "../repository/UserMusicalGender";
import { ParkinsonStage } from "../repository/ParkinsonStage";
import { MusicalGender } from "../repository/MusicalGender";

import { ErrorMessage, SendError, SuccessMessage } from "../messages";
import { SystemRole_RecommendMusics, UserRole_Recommend } from "../config/openai-prompts";
import { AuthJWT } from "../middlewares";

export const openai = express.Router();
const openai_api = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

openai.get("/openai/get-music-recommendations-byuser/:userId", AuthJWT, async (req, res) => {
  try {
    if (!req.params.userId || !Number(req.params.userId)) res.status(400).json(new ErrorMessage("The id has not been sent."));

    const user = await User.getUserById(Number(req.params.userId));
    if (!user) res.status(404).json(new ErrorMessage("User not found."));

    const range = await ParkinsonStage.getParkinsonStageRangeById(Number(user?.scaleId));
    if (!range) res.status(404).json(new ErrorMessage("Range not found."));

    const userGendersIds = await UserMusicalGender.getUserMusicalGenders(Number(req.params.userId));
    if (!userGendersIds) res.status(404).json(new ErrorMessage("Genders not found."));

    const genders = [];
    for (const genderIds of userGendersIds) {
      const gender = await MusicalGender.getMusicalGenderById(genderIds.genderId);
      genders.push(gender?.name);
    }

    const dataToPrompt = { scale: user?.scaleId ?? 0, musicalGenders: genders, range, max_results: 10 };

    const completion = await openai_api.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SystemRole_RecommendMusics() },
        {
          role: "user",
          content: UserRole_Recommend({ ...dataToPrompt }),
        },
      ],
    });
    if (!completion.choices[0].message.content) throw new ErrorMessage("Server failed internally to get music recommendations.");

    res.status(200).json(new SuccessMessage(JSON.parse(completion.choices[0].message.content ?? "")));
  } catch (error: any) {
    res.status(500).send(SendError(error));
  }
});
