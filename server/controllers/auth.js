import User from "../models/user";
import { hashPassword, comparePassword } from "../helpers/auth";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  // console.log("Register endpoint =>", req.body);
  const { name, email, password, secret } = req.body;
  if (!name) return res.status(400).send("Name is required.");
  if (!password || password.length < 6)
    return res
      .status(400)
      .send("Password is required and should be at least 6 characters long.");
  if (!secret) return res.status(400).send("Answer is required.");
  if (!name) return res.status(400).send("Name is required.");
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).send("This email is already used.");

  const hashedPassword = await hashPassword(password);

  const user = new User({ name, email, password: hashedPassword, secret });
  try {
    await user.save();
    // console.log("Registered user =>", user);
    return res.json({
      ok: true,
    });
  } catch (err) {
    console.log("Registering new user failed =>", err);
    return res.status(400).send("Error. Try again.");
  }
};

export const login = async (req, res) => {
  // console.log(req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("No user found.");
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send("Wrong password.");
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    user.password = undefined;
    user.secret = undefined;
    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    // res.json(user);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};
