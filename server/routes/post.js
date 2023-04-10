import express from "express";

const router = express.Router();

import { requireSignIn } from "../middlewares";

import { createPost } from "../controllers/post";

router.post("/create-post", requireSignIn, createPost);

module.exports = router;
