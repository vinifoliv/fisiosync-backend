import express from 'express';
import cors from 'cors';

const PORT = 3000;

const app = express();
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => { res.send("API is running!"); });

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));