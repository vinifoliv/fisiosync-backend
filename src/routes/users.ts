import express from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

const users = express.Router();

users.get('/users', async (req, resp) => {
    try {
        const users = await User.getUsers();
        
        resp.status(200).json(users);
    }
    catch (error) {
        resp.status(500).send(error);
    }
});

users.post('/create-user', async (req, resp) => {
    const data = req.body;

    try {
        // Validating
        if (!data || !data.email || !data.password) 
            resp.status(400).send('The email or the password have not been sent.');

        const user = new User(data.email, data.password);

        // Hashing the password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;

        // Inserting into the database
        const result = await user.createUser();
        if (!result) throw new Error("Server failed internally to create user.");

        resp.sendStatus(201);
    }
    catch (error) {
        resp.status(500).send(error);
    }
});

export default users;