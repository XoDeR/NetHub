import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const morgan = require("morgan");
require("dotenv").config();

const app = express();

mongoose
  .connect(process.env.DATABASE, {
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB connection error =>", err));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);

app.post("/api/register", (req, res) => {
  console.log("Register endpoint =>", req.body);
});

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
