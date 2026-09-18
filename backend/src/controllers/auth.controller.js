import userModel from "../models/user.model.js";
import { generateToken } from "../utils/token .js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, targetRole } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Check if user already exists
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create User
    const user = await userModel.create({
      name,
      email,
      password,
      targetRole: targetRole || "Full-Stack Developer",
    });

    const accessToken = generateToken(user._id,"10m")
    const refreshToken = generateToken(user._id,"30d")
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      expiretime: 10*60*1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      expiretime: 30*24*60*60*1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find User
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Match Password
    const isMatch = await user.comparePass(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const accessToken = generateToken(user._id,"10m")
    const refreshToken = generateToken(user._id,"30d")
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      expiretime: 10*60*1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      expiretime: 30*24*60*60*1000,
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};