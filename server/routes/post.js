import express from "express";
import formidable from "express-formidable";

const router = express.Router();

import { requireSignIn } from "../middlewares";

import { createPost, uploadImage, postsByUser } from "../controllers/post";

router.post("/create-post", requireSignIn, createPost);
router.post(
  "/upload-image",
  requireSignIn,
  formidable({ maxFileSize: 5 * 1024 * 1024 }),
  uploadImage
);

router.get("/user-posts", requireSignIn, postsByUser);

module.exports = router;
