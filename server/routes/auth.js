import express from "express";

const router = express.Router();

import { requireSignIn } from "../middlewares";

import {
  register,
  login,
  currentUser,
  forgotPassword,
  profileUpdate,
  findPeople,
} from "../controllers/auth";

router.post("/register", register);
router.post("/login", login);
router.get("/current-user", requireSignIn, currentUser);
router.post("/forgot-password", forgotPassword);

router.put("/profile-update", requireSignIn, profileUpdate);
router.get("/find-people", requireSignIn, findPeople);

module.exports = router;
