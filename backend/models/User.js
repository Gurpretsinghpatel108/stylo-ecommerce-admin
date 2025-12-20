// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    phone: {
      type: String,
      default: "",
      trim: true,
      // Optional: agar sirf Indian number chahiye toh yeh laga sakta hai
      // match: [/^[6-9]\d{9}$/, "Please enter a valid Indian phone number"]
    },
    photo: {
      type: String,
      default: "",
    },
    wallet: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);