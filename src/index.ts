import express from "express";
import cors from "cors";
import * as Routes from "./routes/";

require("dotenv").config({ override: true });

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(Routes.auth);
app.use(Routes.users);
app.use(Routes.musicalGenders);
app.use(Routes.parkinsonStage);
app.use(Routes.openai);
app.use(Routes.gemini);
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

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
