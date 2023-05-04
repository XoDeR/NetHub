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

// io.on("connect", (socket) => {
//   // console.log("Socket.IO", socket.id);
//   socket.on("send-message", (message) => {
//     // console.log("new message received => ", message);
//     socket.broadcast.emit("receive-message", message);
//   });
// });

io.on("connect", (socket) => {
  socket.on("new-post", (newPost) => {
    // console.log("SocketIO new post => ", newPost);
    socket.broadcast.emit("new-post", newPost);
  });
});

const port = process.env.PORT || 8000;

// app.listen(port, () => console.log(`Server is running on port ${port}`));
http.listen(port, () => console.log(`Server is running on port ${port}`));
