/** @format */

import express from "express";
import {
	login,

	signup,
	verificationAccount,
	sendVerificationCode,
	forgotPassword,
	changePassword,
	verifyCode
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify/:verificationCode", verificationAccount);
router.post("/send-code", sendVerificationCode);
router.post("/forgot-password", forgotPassword);
router.put("/change-password", changePassword);
router.put("/verify-code", verifyCode);

export default router;
