import express from 'express';
import { User } from '../models/User';

const users = express.Router();

users.post('/create-user', async (req, resp) => {
    const data = req.body;

    try {
        if (!data || !data.email || !data.password) 
            resp.status(400).send('The email or the password have not been sent.');

        const user = new User(data.email, data.password);
        if (!user) throw new Error("Server failed internally to create user.");

        resp.sendStatus(201);
    }
    catch (error) {
        resp.status(500).send(error);
    }
});

export default users;