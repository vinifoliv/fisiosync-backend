import express from "express";
import bcrypt from "bcrypt";

import { ErrorMessage, SendError, SuccessMessage } from "../messages";
import { User, UserProps } from "../repository/User";
import { MusicalGender } from "../repository/MusicalGender";
import { UserMusicalGender } from "../repository/UserMusicalGender";
import { AuthJWT } from "../middlewares";

export const users = express.Router();
const jwt = require("jsonwebtoken");

users.post("/login", async (req, res) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;
    const user = await User.getUserByEmail(email);
    if (!user) throw new ErrorMessage("User does not exist.");
    if (!(await bcrypt.compare(password, user.password))) throw new ErrorMessage("Password is incorrect.");
    const payload = { id: user.id, password: password };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "48hr" });
    res.status(200).json(new SuccessMessage({ token }));
  } catch (error: any) {
    res.status(500).send(SendError(error));
  }
});

users.get("/users", AuthJWT, async (req, res) => {
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
      res.status(400).json(new ErrorMessage("The email or the password have not been sent."));

    const existingEmail = await User.getUserByEmail(data.email);
    if (existingEmail) res.status(400).json(new ErrorMessage("Email already exists."));

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

users.get("/get-users", AuthJWT, async (req, res) => {
  try {
    const result = await User.getUsers();
    res.status(200).json(new SuccessMessage(result));
  } catch (error: any) {
    res.status(500).send(SendError(error));
  }
});

users.get("/get-users/:id", AuthJWT, async (req, res) => {
  try {
    if (!req.params.id) throw new ErrorMessage("The id has not been sent.");

    const user = await User.getUserById(Number(req.params.id));
    if (!user) res.status(404).json(new ErrorMessage("User not found."));

    res.status(200).json(new SuccessMessage(user));
  } catch (error: any) {
    res.status(500).send(SendError(error));
  }
});

users.put("/update-user", AuthJWT, async (req, res) => {
  try {
    const { id, ...user } = req.body;

    // Validating
    if (!user.name || !user.email || !user.password || !user.scale) throw new ErrorMessage("Not all the fields have been sent.");

    // Updating the user
    const updatedUser = await User.updateUser(id, user);
    if (!updatedUser) throw new ErrorMessage("Server failed to update user ", user.name);

    // Updating user's musical genders
    const newGendersIds = await MusicalGender.getMusicalGenderIdsByName(user.musicalGenders);
    const dbGendersIds = await UserMusicalGender.getUserMusicalGendersIds(id);
    const gendersToAdd = newGendersIds.filter((id) => !dbGendersIds.includes(id));
    const gendersToRemove = dbGendersIds.filter((id) => !newGendersIds.includes(id));

    await UserMusicalGender.updateUserMusicalGenders(id, gendersToAdd, gendersToRemove);

    res.status(200).json(new SuccessMessage(user));
  } catch (error: any) {
    res.status(500).send(SendError(error));
  }
});
