import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

router.post("/register", async(req, res) => {
    try {
        const { email, username, password } = req.body;
      
        if (!username || !email || !password) {
          return res.status(400).json({ message: "All fields are required" });
        }
      
        if (password.length < 6) {
          return res.status(400).json({ message: "Password should be at least 6 characters long" });
        }
      
        if (username.length < 3) {
          return res.status(400).json({ message: "Username should be at least 3 characters long" });
        }
        
        // check if user already exists
        // const existingUser = await User.findOne({$or:[{email}, {username}]});
        // if(existingUser) return res.status(400).json({ message: "User already exists" });

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
        }
        
        //get random avatar
        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

        const user = new User({
          email,
          username,
          password,
          profileImage,
        });

        await user.save();

        const token = generateToken(user._id);

        console.log("User registered:", user);
        res.status(201).json({
          token,
          user:{
            id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
            createdAt: user.createdAt,
          },
        });

      } catch (error) {
        // ... error handling logic here
        console.error("Error in Register Route:", error);
        res.status(500).json({ message: "Internal server error" });
      }
});

router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "All fields are required" });
    
        // check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
    
        // check if password is correct
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });
    
        const token = generateToken(user._id);

        console.log("User logged in:", user);

        res.status(200).json({
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
            createdAt: user.createdAt,
        },
        });
    
      } catch (error) {
        // ... error handling logic
        console.error("Error in Login Route:", error);
        res.status(500).json({ message: "Internal server error" });
      }
});

export default router;