import express from "express";
import { User } from "../repository/User";
import bcrypt from "bcrypt";
import type { UserProps } from "../repository/User";
import { MusicalGender } from "../repository/MusicalGender";

export const users = express.Router();
const jwt = require("jsonwebtoken");

users.get("/users", async (req, res) => {
  try {
    const users = await User.getUsers();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

users.post("/create-user", async (req, res) => {
  const data = req.body;

  try {
    // Validating
    if (!data.name || !data.email || !data.password || !data.musicalGenders || !data.scale)
      res.status(400).send("The email or the password have not been sent.");

    data.musicalGenders = MusicalGender.getMusicalGenderIdsByName(data.musicalGenders);

    const user = new User(data as UserProps);

    // Hashing the password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;

    // Inserting into the database
    const result = await user.createUser();
    if (!result) throw new Error("Server failed internally to create user.");

    // Generating token
    const payload = { id: result.id, password: result.password };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

    // Response
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).send(error);
  }
});

users.get("/get-users", async (req, res) => {
  try {
    const result = await User.getUsers();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
});
