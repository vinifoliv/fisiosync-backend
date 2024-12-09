import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { User } from "../repository/User";
import { UserMusicalGender } from "../repository/UserMusicalGender";
import { ParkinsonStage } from "../repository/ParkinsonStage";
import { MusicalGender } from "../repository/MusicalGender";

import { ErrorMessage, SendError, SuccessMessage } from "../messages";
import { UserRole } from "../config/gemini-prompts";

export const gemini = express.Router();
const gemini_api = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

gemini.get("/gemini/get-music-recommendations-byuser/:userId", async (req, res) => {
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

    const dataToPrompt = { scale: user?.scaleId ?? 0, musicalGenders: genders, range, max_results: 20 };

    const model = gemini_api.getGenerativeModel({ model: "gemini-1.5-pro" });
    const chat = model.startChat({
      //   history: [{ role: "user", parts: [{ text: SystemRole_RecommendMusics() }] }],
      generationConfig: {
        maxOutputTokens: 2000,
      },
    });
    const result = await chat.sendMessage(UserRole.RecommendMusics({ ...dataToPrompt }));
    const response = await result.response;
    const text = response.text();
    if (!text) throw new ErrorMessage("Server failed internally to get music recommendations.");

    let musics;
    try {
      musics = JSON.parse(text);
    } catch (error) {
      musics = JSON.parse(text.split("```").join("").split("json")[1] ?? "");
    }

    res.status(200).json(new SuccessMessage(musics));
  } catch (error: any) {
    res.status(500).send(SendError(error));
  }
});

gemini.post("/gemini/get-music-bpm", async (req, res) => {
  try {
    if (!req.body?.music) res.status(400).json(new ErrorMessage("The music has not been sent."));

    const model = gemini_api.getGenerativeModel({ model: "gemini-1.5-pro" });
    const chat = model.startChat({
      generationConfig: {
        maxOutputTokens: 2000,
      },
    });
    const result = await chat.sendMessage(UserRole.GetMusicBPM(req.body.music));
    const response = await result.response;
    const text = response.text();
    if (!text) throw new ErrorMessage("Server failed internally to get music recommendations.");

    let music;
    try {
      music = JSON.parse(text);
    } catch (error) {
      music = JSON.parse(text.split("```").join("").split("json")[1] ?? "");
    }

    res.status(200).json(new SuccessMessage(music));
  } catch (error: any) {
    res.status(500).send(SendError(error));
  }
});
