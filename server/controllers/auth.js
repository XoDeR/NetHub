import User from "../models/user";
import { hashPassword, comparePassword } from "../helpers/auth";

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
