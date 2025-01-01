// Importing required modules using ES6 import syntax
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import Users from "../models/Users.js"; // Ensure you use .js extension for ES modules
import generateOtp from "../utils/otpGenerator.js";
import { sendVerificationEmail, sendPasswordResetEmail, sendResetSuccessEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

// Signup function
export const signup = async (req, res) => {
  try {
    let { email, name, password, phoneNumber } = req.body;

    email = email.toLowerCase();

    const errors = [];
    if (!email) errors.push("Please fill in email!");
    if (!name) errors.push("Please fill in name!");
    if (!phoneNumber) errors.push("Please fill in phone number!");
    if (!password) errors.push("Please fill in password!");

    if (errors.length) {
      return res.status(400).json({ status: 400, errors });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ status: 400, errors: ["Please use a valid email!"] });
    }

    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ status: 400, errors: ["User already registered"] });
    }

    const hashPassword = await bcryptjs.hash(password, 10);
    const verificationCode = generateOtp(); // Generate a verification code
    const expirationTime = Date.now() + 15 * 60 * 1000;
    const user = await Users.create({
      email,
      name,
      phoneNumber,
      verificationCode,
      verificationCodeExpires: expirationTime,
      password: hashPassword,
      verified: false
    });

    // Send a verification email
    // await sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      status: 201,
      message: "User registered successfully. A verification code has been sent to your email.",
      data: { userId: user.id, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, errors: ["Internal server error"] });
  }
};

// Login function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 400, errors: ["Please fill in email and password!"] });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ status: 400, errors: ["Please use a valid email!"] });
    }

    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ status: 404, errors: ["User doesn't exist"] });
    }

    const match = await bcryptjs.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ status: 401, errors: ["Wrong username and password combination"] });
    }

    const secretKey = "sangkiplaimportantkey"; // You can replace this with a process.env value for better security
    const userToken = jwt.sign(
      {
        id: user.id,
        userType: user.userType,
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
        verificationCode: user.verificationCode,
        verified: user.verified
      },
      secretKey,
      { expiresIn: "60d" }
    );

    res.status(200).json({ message: "Login success", token: userToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, errors: ["Internal server error"] });
  }
};

// Send verification code function
export const sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ status: 400, errors: ["User not found"] });
    }

    const verificationCode = generateOtp();
    user.verificationCode = verificationCode;
    await user.save();

    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({ status: 200, message: "Verification code sent successfully" });
  } catch (error) {
    res.status(500).json({ status: 500, errors: error.message });
  }
};

// Verification account function
export const verificationAccount = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ status: 400, errors: ["User not found"] });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ status: 400, errors: ["Invalid Code"] });
    }

    user.verificationCode = "";
    user.verified = true;

    await user.save();
    await sendWelcomeEmail(email);

    res.status(200).json({ status: 200, message: "User is verified" });
  } catch (error) {
    res.status(500).json({ status: 500, errors: error.message });
  }
};

// Forgot password function
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ status: 400, errors: ["User not found"] });
    }

    const verificationCode = generateOtp();
    user.verificationCode = verificationCode;
    await user.save();

    await sendPasswordResetEmail(email, verificationCode);

    res.status(200).json({ message: "Verification code sent successfully" });
  } catch (error) {
    res.status(500).json({ status: 500, errors: error.message });
  }
};

// Change password function
export const changePassword = async (req, res) => {
  try {
    const { email, newPassword, verificationCode } = req.body;

    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ status: 400, errors: ["User not found"] });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ status: 400, errors: ["Invalid verification code"] });
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    user.verificationCode = ""; // Clear verification code
    await user.save();

    await sendResetSuccessEmail(email);

    res.status(200).json({ status: 200, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ status: 500, errors: error.message });
  }
};

// Verify code function
export const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ status: 400, errors: ["User not found"] });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ status: 400, errors: ["Invalid verification code"] });
    }

    if (user.verificationCodeExpires < Date.now()) {
      return res.status(400).json({ status: 400, errors: ["Verification code has expired"] });
    }

    user.verificationCode = ""; // Clear the verification code
    user.verified = true; // Mark as verified
    await user.save();

    res.status(200).json({ status: 200, message: "User verified successfully" });
  } catch (error) {
    res.status(500).json({ status: 500, errors: error.message });
  }
};


