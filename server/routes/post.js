import express from "express";
import formidable from "express-formidable";

const router = express.Router();

import { requireSignIn, canEditDeletePost } from "../middlewares";

import {
  createPost,
  uploadImage,
  userPost,
  updatePost,
  deletePost,
  newsFeed,
} from "../controllers/post";

router.post("/create-post", requireSignIn, createPost);
router.post(
  "/upload-image",
  requireSignIn,
  formidable({ maxFileSize: 5 * 1024 * 1024 }),
  uploadImage
);

router.get("/user-post/:_id", requireSignIn, userPost);
router.put("/update-post/:_id", requireSignIn, canEditDeletePost, updatePost);
router.delete(
  "/delete-post/:_id",
  requireSignIn,
  canEditDeletePost,
  deletePost
);

router.get("/news-feed", requireSignIn, newsFeed);

module.exports = router;
