// Importing required modules using ES6 const syntax
const bcryptjs = require("bcryptjs");
const CryptoJS = require("crypto-js");
const generateOtp = require("../utils/otpGenerator");
const {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendWelcomeEmail,
  sendVerificationEmail,
} = require("../brevo/email.brevo");
const generateAuthToken = require("../utils/generateAuthToken");
const { Users } = require("../models");

// Signup function
const signup = async (req, res) => {
  try {
    let { email, name, password, phoneNumber } = req.body;

    email = email.toLowerCase();

    const errors = [];
    if (!email) errors.push("Please fill in email!");
    if (!name) errors.push("Please fill in name!");
    if (!phoneNumber) errors.push("Please fill in phone number!");
    if (!password) errors.push("Please fill in password!");

    if (errors.length) {
      return res.status(400).json({ status: false, errors });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ status: false, message: "Please use a valid email!" });
    }

    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "User already registered" });
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
      verified: false,
    });

    // Send a verification email
    await sendVerificationEmail(email, name, verificationCode);

    res.status(201).json({
      status: 201,
      message:
        "User registered successfully. A verification code has been sent to your email.",
      data: { userId: user.id, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Login function
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "Please fill in email and password!" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ status: false, message: "Please use a valid email!" });
    }

    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User doesn't exist" });
    }

    const match = await bcryptjs.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({
          status: false,
          message: "Wrong username and password combination",
        });
    }

    const userToken = generateAuthToken(user);

    res.status(200).json({ message: "Login success", token: userToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ status: false, message: "No such user, please register first." });
    }

    // Generate a reset token using crypto
    const resetToken = generateOtp()
    const resetTokenExpires = Date.now() + 3600000; // Token expires in 1 hour

    // Save the reset token and expiration time to the user's record
    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    await user.save();

    // Send an email to the user with the reset link
    const resetLink = resetToken
    // const resetLink = `https://yourapp.com/reset-password?token=${resetToken}`;

    sendPasswordResetEmail(email, resetLink);

    res
      .status(200)
      .json({ status: true, message: "Password reset code sent successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const verifyAccount = async (req, res) => {
  try {
    const { verificationCode } = req.body;

    const user = await Users.findOne({ where: { verificationCode } });

    if (!user || !user.verificationCodeExpires || user.verificationCodeExpires < Date.now()) {
      return res.status(400).json({ status: false, message: "Invalid or expired verification code" });
    }

    user.verified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({ status: true, message: "Account successfully verified" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const changePassword = async (req, res) => {
  try {
    // const token = req.params.token;
    // const password = req.body.password;

    const { code, email, password} = req.body

    // Check if newPassword is provided
    if (!password) {
      return res
        .status(400)
        .json({ status: false, message: "New password is required" });
    }

    // Find the user by reset token
    const user = await Users.findOne({ where: { email: email } });

    if (!user || user.resetToken !== code || user.resetTokenExpires < Date.now()) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid or expired code." });
    }

    // Check if the reset token has expired
    if (!user.resetTokenExpires || user.resetTokenExpires < Date.now()) {
      return res
        .status(400)
        .json({ status: false, message: "Reset token has expired" });
    }

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Update the user's password
    user.password = hashedPassword;
    user.resetToken = null; 
    user.resetTokenExpires = null;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ status: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  login,
	verifyAccount,
	signup,
	forgotPassword,
	changePassword,
};
