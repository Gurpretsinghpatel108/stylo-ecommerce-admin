import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Cart from "../models/Cart.js"; // YE LINE ADD KARNA ZAROORI HAI BHAI

// REGISTER / CREATE ACCOUNT
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Naye user ke liye empty cart bana do
    await Cart.create({
      userId: newUser._id,
      items: []
    });

    res.status(201).json({ 
      success: true, 
      message: "Account created successfully!" 
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// LOGIN - AB YE SABSE BEST HAI BHAI
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Token generate karo
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // USER KA CART BHI BHEJ DO – YE HAI MAGIC LINE
    const userCart = await Cart.findOne({ userId: user._id });
    const cartItems = userCart ? userCart.items : [];

    res.status(200).json({
      success: true,
      token,
      cart: { items: cartItems } // Frontend ko direct items mil jayenge
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};