// Importing required modules using ES6 import syntax
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import Users from "../models/Users.js"; // Ensure you use .js extension for ES modules
import generateOtp from "../utils/otpGenerator.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendWelcomeEmail,
  sendVerificationEmail } from "../brevo/email.brevo.js";

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
    await sendVerificationEmail(email, verificationCode);

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

export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		// Find the user by email
		const user = await Users.findOne({ where: { email } });

		if (!user) {
			return res.status(404).json({ status: false, message: "User not found" });
		}

		// Generate a reset token using crypto
		const resetToken = CryptoJS.lib.WordArray.random(20).toString(CryptoJS.enc.Hex);
		const resetTokenExpires = Date.now() + 3600000; // Token expires in 1 hour
	
		// Save the reset token and expiration time to the user's record
		user.resetToken = resetToken;
		user.resetTokenExpires = resetTokenExpires;
		await user.save();

	

		// Send an email to the user with the reset link
		const resetLink = `https://monster-client.onrender.com/auth/reset-password/${resetToken}`
		// const resetLink = `https://yourapp.com/reset-password?token=${resetToken}`;

		sendPasswordResetEmail(email, resetLink)

		res.status(200).json({ status: true, message: "Password reset link sent successfully" });
	} catch (error) {
		res.status(500).json({ status: false, message: error.message });
	}
		
};

export const verifyAccount = async (req, res) => {
    try {
        const { verificationCode } = req.body;

        const user = await Users.findOne({ where: { verificationCode } });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification code" });
        }

        if (user.verificationCodeExpiresAt < Date.now()) {
            return res.status(400).json({ message: "Verification code has expired" });
        }

        user.verified = true;
        user.verificationCode = null;
        user.verificationCodeExpiresAt = null;
        await user.save();

		await sendWelcomeEmail(user.email, user.name)

        res.status(200).json({ message: "Account successfully verified" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const changePassword = async (req, res) => {
	try {
		const token = req.params.token
		const password = req.body.password

		// Check if newPassword is provided
		if (!password) {
			return res.status(400).json({ status: false, message: "New password is required" });
		}

		// Find the user by reset token
		const user = await Users.findOne({ where: { resetToken: token } });

		if (!user) {
			return res.status(400).json({ status: false, message: "Invalid reset token" });
		}

		// Check if the reset token has expired
		if (!user.resetTokenExpires || user.resetTokenExpires < Date.now()) {
			return res.status(400).json({ status: false, message: "Reset token has expired" });
		}

		// Hash the new password
		const hashedPassword = await bcryptjs.hash(password, 10);

		// Update the user's password
		user.password = hashedPassword;
		user.resetToken = null; // Remove reset token after successful password change
		user.resetTokenExpires = null; // Remove token expiration
		await user.save();

		await sendResetSuccessEmail(user.email)

		res.status(200).json({ status: true, message: "Password reset successfully" });
	} catch (error) {
		res.status(500).json({ status: false, message: error.message });
	}
};


