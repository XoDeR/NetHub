import express from "express";

const router = express.Router();

import { requireSignIn, isAdmin } from "../middlewares";

import {
  register,
  login,
  currentUser,
  forgotPassword,
  profileUpdate,
  findPeople,
  addFollower,
  userFollow,
  userFollowing,
  removeFollower,
  userUnfollow,
  searchUser,
  getUser,
} from "../controllers/auth";

router.post("/register", register);
router.post("/login", login);
router.get("/current-user", requireSignIn, currentUser);
router.post("/forgot-password", forgotPassword);

router.put("/profile-update", requireSignIn, profileUpdate);
router.get("/find-people", requireSignIn, findPeople);

router.put("/user-follow", requireSignIn, addFollower, userFollow);
router.put("/user-unfollow", requireSignIn, removeFollower, userUnfollow);
router.get("/user-following", requireSignIn, userFollowing);

router.get("/search-user/:query", searchUser);
router.get("/user/:username", getUser);

router.get("/current-admin", requireSignIn, isAdmin, currentUser);

module.exports = router;
