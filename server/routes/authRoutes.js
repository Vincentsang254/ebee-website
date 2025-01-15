/** @format */

const express = require("express");
const {
	login,

	signup,
	forgotPassword,
	changePassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
// router.post("/verify/:verificationCode", verificationAccount);
router.post("/forgot-password", forgotPassword);
router.put("/change-password", changePassword);

module.exports = router;
