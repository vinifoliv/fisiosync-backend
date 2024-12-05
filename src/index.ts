import express from 'express';
import cors from 'cors';
import users from './routes/users';
require('dotenv').config({ override: true });

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(users);
app.use(cors({
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization'
}));

app.get('/', (req, res) => { res.send("API is running!"); });

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));