import express from "express";
import cors from "cors";
import users from "./routes/Users";
import { parkinsonStage } from "./routes/ParkinsonStage";
import { musicalGenders } from "./routes/MusicalGender";
import auth from "./routes/auth";

require("dotenv").config({ override: true });

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(auth);
app.use(users);
app.use(musicalGenders);
app.use(parkinsonStage);
app.use(
  cors({
    origin: "*",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Accept, Authorization",
  })
);

app.get("/", (req, res) => {
  res.send("API is running!");
});

app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`)
);
