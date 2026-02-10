// import User from "../models/User.js";
// import { hashPassword, generateToken } from "../utils/auth.js";
// import { sendMail } from "../services/nodemailer.js";

// // ================= REGISTER =================
// export const register = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     // STUDENT EMAIL VALIDATION
//     if (role === "student") {
//       const studentEmailRegex =
//         /^(2022|2023|2024|2025)(kuec|kucp|kuad)\d{4}@iiitkota\.ac\.in$/;

//       if (!studentEmailRegex.test(email)) {
//         return res.status(400).json({
//           message:
//             "Only IIIT Kota student emails (2022–2025, kuec/kucp/kuad) allowed",
//         });
//       }
//     }

//     const existingUser = await User.findOne({ email });
//     const otp = Math.floor(1000 + Math.random() * 9000);

//     // Already verified
//     if (existingUser && existingUser.isEmailVerified) {
//       return res.status(400).json({ message: "User already registered" });
//     }

//     // Exists but not verified → resend OTP
//     if (existingUser && !existingUser.isEmailVerified) {
//       existingUser.emailOtp = otp;
//       await existingUser.save();
//       await sendMail(email, otp);
//       return res.status(200).json({ message: "OTP resent" });
//     }

//     // Create new user
//     await User.create({
//       name,
//       email,
//       role,
//       password: hashPassword(password),
//       emailOtp: otp,
//       isEmailVerified: false,
//     });

//     await sendMail(email, otp);

//     return res.status(200).json({ message: "OTP sent successfully" });
//   } catch (error) {
//     console.error("Register error:", error);
//     return res.status(500).json({ message: "Registration failed" });
//   }
// };

// // ================= VERIFY OTP =================
// export const verifyOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid email" });
//     }

//     if (user.emailOtp !== Number(otp)) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     user.emailOtp = null;
//     user.isEmailVerified = true;
//     await user.save();

//     const token = generateToken({ userId: user._id });

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: false, // true in production (https)
//       sameSite: "strict",
//     });

//    return res.status(200).json({
//   message: "OTP verified successfully",
//   name: user.name,     // ✅ ADD THIS
//   email: user.email,   // ✅ ADD THIS
//   role: user.role,
// });

//   } catch (error) {
//     console.error("Verify OTP error:", error);
//     return res.status(500).json({ message: "OTP verification failed" });
//   }
// };

import User from "../models/User.js";
import crypto from "crypto";
import { generateToken } from "../utils/auth.js";
import { sendMail } from "../services/nodemailer.js";

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // STUDENT EMAIL VALIDATION
    if (role === "student") {
      const studentEmailRegex =
        /^(2022|2023|2024|2025)(kuec|kucp|kuad)\d{4}@iiitkota\.ac\.in$/;

      if (!studentEmailRegex.test(email)) {
        return res.status(400).json({
          message:
            "Only IIIT Kota student emails (2022–2025, kuec/kucp/kuad) allowed",
        });
      }
    }

    const existingUser = await User.findOne({ email });
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Already verified
    if (existingUser && existingUser.isEmailVerified) {
      return res.status(400).json({ message: "User already registered" });
    }

    // Exists but not verified → resend OTP
    if (existingUser && !existingUser.isEmailVerified) {
      existingUser.emailOtp = otp;
      await existingUser.save();
      await sendMail(email, otp);
      return res.status(200).json({ message: "OTP resent" });
    }

    // Hash password
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    await User.create({
      name,
      email,
      role,
      password: hashedPassword,
      emailOtp: otp,
      isEmailVerified: false,
    });

    await sendMail(email, otp);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Registration failed" });
  }
};

// ================= VERIFY OTP =================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    if (user.emailOtp !== Number(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.emailOtp = null;
    user.isEmailVerified = true;
    await user.save();

    const token = generateToken({ userId: user._id });

    // return res.status(200).json({
    //   message: "OTP verified successfully",
    //   token,
    //   role: user.role,
    //   name: user.name,
    //   email: user.email,
    // });

res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  
});

return res.status(200).json({
  message: "OTP verified successfully",
  role: user.role,
  name: user.name,
  email: user.email,
});


  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ message: "OTP verification failed" });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    // 1. Check user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isEmailVerified) {
      return res.status(400).json({ message: "Email not verified" });
    }

    // 2. Hash incoming password
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    // 3. Compare passwords
    if (hashedPassword !== user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4. Generate token
    const token = generateToken({ userId: user._id });

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: false, // true in production
    //   sameSite: "None",
    // });

  res.cookie("token", token, {
  httpOnly: true,
  secure: true,       
  sameSite: "None",    
  
});


    // 5. Send user data
    return res.status(200).json({
      message: "Login successful",
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};