import express from "express";
import bcrypt from "bcrypt";

import { ErrorMessage, SendError, SuccessMessage } from "../messages";
import { User, UserProps } from "../repository/User";
import { MusicalGender } from "../repository/MusicalGender";

export const users = express.Router();
const jwt = require("jsonwebtoken");

users.get("/users", async (req, res) => {
  try {
    const users = await User.getUsers();
    res.status(200).json(new SuccessMessage(users));
  } catch (error: any) {
    res.status(500).send(SendError(error));
  }
});

users.post("/create-user", async (req, res) => {
  const data = req.body;

  try {
    // Validating
    if (!data.name || !data.email || !data.password || !data.musicalGenders || !data.scale)
      res.status(400).send(new ErrorMessage("The email or the password have not been sent."));

    const existingEmail = await User.getUserByEmail(data.email);
    if (existingEmail) res.status(400).send(new ErrorMessage("Email already exists."));

    data.musicalGenders = await MusicalGender.getMusicalGenderIdsByName(data.musicalGenders);

    const user = new User(data as UserProps);

    // Hashing the password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;

    // Inserting into the database
    const result = await user.createUser();
    if (!result) throw new ErrorMessage("Server failed internally to create user.");

    // Generating token
    const payload = { id: result.id, password: result.password };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

    // Response
    res.status(201).json(new SuccessMessage({ token }));
  } catch (error: any) {
    res.status(500).send(SendError(error));
  }
});

users.get("/get-users", async (req, res) => {
  try {
    const result = await User.getUsers();
    res.status(200).json(new SuccessMessage(result));
  } catch (error: any) {
    res.status(500).send(SendError(error));
  }
});

users.get("/get-users/:id", async (req, res) => {
  try {
    if (!req.params.id) throw new ErrorMessage("The id has not been sent.");

    const user = await User.getUserById(Number(req.params.id));
    if (!user) res.status(404).send(new ErrorMessage("User not found."));

    res.status(200).json(new SuccessMessage(user));
  } catch (error: any) {
    res.status(500).send(SendError(error));
  }
});
