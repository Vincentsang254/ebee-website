/** @format */

import express from "express";
import {
	login,

	signup,
	forgotPassword,
	changePassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
// router.post("/verify/:verificationCode", verificationAccount);
router.post("/forgot-password", forgotPassword);
router.put("/change-password", changePassword);

export default router;
