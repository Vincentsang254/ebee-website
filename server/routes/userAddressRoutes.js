// const necessary modules
const express = require("express");
const {
  createAddress,
  updateUserAddress,
  getUserAddress
} = require("../controllers/userAddressController");  // Ensure to use the  extension
const { verifyToken } = require("../middlewares/AuthMiddleware");

const router = express.Router();

// Define routes
router.get("/get",verifyToken, getUserAddress);
router.post("/create",verifyToken, createAddress);
router.put("/update/:addressId",verifyToken, updateUserAddress);

module.exports = router;
