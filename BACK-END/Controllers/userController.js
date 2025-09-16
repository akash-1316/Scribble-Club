import userModel from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

// 🔑 Generate Access & Refresh Tokens
const createAccessToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const createRefreshToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
};

// LOGIN  
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User doesn't exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    const role = user.role;
    const accessToken = createAccessToken(user._id, role);
    const refreshToken = createRefreshToken(user._id, role);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      accessToken,
      refreshToken,
      role,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// REGISTER
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await userModel.findOne({ email });
    if (exists) return res.json({ success: false, message: "User already exists" });

    if (!validator.isEmail(email)) return res.json({ success: false, message: "Invalid email" });
    if (password.length < 8) return res.json({ success: false, message: "Weak password" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    const role = user.role;
    const accessToken = createAccessToken(user._id, role);
    const refreshToken = createRefreshToken(user._id, role);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      accessToken,
      refreshToken,
      role,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error" });
  }
};

// REFRESH TOKEN
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ success: false, message: "No refresh token" });

    const user = await userModel.findOne({ refreshToken });
    if (!user) return res.status(403).json({ success: false, message: "Invalid refresh token" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ success: false, message: "Invalid refresh token" });

      const newAccessToken = createAccessToken(user._id, user.role);
      res.json({ success: true, accessToken: newAccessToken });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export { loginUser, registerUser, refreshToken };
