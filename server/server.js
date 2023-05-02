import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { readdirSync } from "fs";

const morgan = require("morgan");
require("dotenv").config();

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-type"],
  },
});

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
    origin: [process.env.CLIENT_URL],
  })
);

readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

io.on("connect", (socket) => {
  console.log("Socket.IO", socket.id);
});

const port = process.env.PORT || 8000;

// app.listen(port, () => console.log(`Server is running on port ${port}`));
http.listen(port, () => console.log(`Server is running on port ${port}`));
