import userModel from "../models/user.model.js";
import { generateToken } from "../utils/token .js";
export const registerUser = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      degree, 
      targetRole, 
      careerGoalDescription, 
      currentExperience, 
      targetIndustry, 
      currentSkills 
    } = req.body;

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

    // Create User with all career preferences
    const user = await userModel.create({
      name,
      email,
      password, // Note: Ensure password hashing (bcrypt) is handled in your user model pre-save hook
      degree: degree || "B.Tech CSE / IT",
      targetRole: targetRole || "Full-Stack Developer",
      careerGoalDescription: careerGoalDescription || "",
      currentExperience: currentExperience || "Beginner",
      targetIndustry: targetIndustry || "Software & IT",
      currentSkills: currentSkills || [],
    });

    // Tokens generation (7 days for development stability)
    const accessToken = generateToken(user._id, "7d");
    const refreshToken = generateToken(user._id, "30d");

    // accessToken cookie for Localhost
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,       // Localhost (HTTP) par false rahega
      sameSite: 'lax',     // Localhost ke liye 'lax'
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    // refreshToken cookie for Localhost
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully with career profile",
      user,
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

        const accessToken = generateToken(user._id, "10m");
        const refreshToken = generateToken(user._id, "30d");

         // accessToken cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,       // Localhost (HTTP) par false rahega
            sameSite: 'lax',     // Localhost ke liye 'lax' zaroori hai ('none' mat rakhna)
            maxAge: 7 * 24 * 60 * 60 * 1000, // expiretime ki jagah maxAge use karein
        });
        // refreshToken cookie
        
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000, // expiretime ki jagah maxAge use karein
        });

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error during login",
            error: error.message,
        });
    }
};

export const getMe = async (req, res) => {
    try {
        // req.user.id humein protect middleware se milta hai jo token decode karta hai
        const user = await userModel.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            user: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}



// POST: /api/auth/logout
export const logoutUser = async (req, res) => {
    try {
        // authMiddleware ki wajah se req.user available hai
        const userId = req.user.id; 

        // 1. Agar Database (Mongoose) me RefreshToken store kar rahe hain toh usse remove/null karein
        await userModel.findByIdAndUpdate(userId, { refreshToken: null });

        // 2. Browser ki Cookies clear karein
        const cookieOptions = {
            httpOnly: true,
            secure: false, // Localhost ke liye false (Production me process.env.NODE_ENV === 'production')
            sameSite: 'lax',
        };

        res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error during logout",
            error: error.message,
        });
    }
};