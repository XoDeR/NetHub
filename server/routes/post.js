import express from "express";
import formidable from "express-formidable";

const router = express.Router();

import { requireSignIn } from "../middlewares";

import { createPost, uploadImage } from "../controllers/post";

router.post("/create-post", requireSignIn, createPost);
router.post(
  "/upload-image",
  requireSignIn,
  formidable({ maxFileSize: 5 * 1024 * 1024 }),
  uploadImage
);

module.exports = router;
