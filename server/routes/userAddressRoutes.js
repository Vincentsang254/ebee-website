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
router.get("/get",getUserAddress);
router.post("/create",createAddress);
router.put("/update/:addressId",updateUserAddress);

module.exports = router;
