// const necessary modules
const express = require("express");
const {
  deleteUser,
  getUsers,
  createUsers,
  updateUser,
  getUserById
} = require("../controllers/userController"); 
const { verifyToken } = require("../middlewares/AuthMiddleware");

const router = express.Router();

// Define routes
router.delete("/delete/:userId",verifyToken, deleteUser);
router.get("/get-users",verifyToken, getUsers);
router.post("/create",verifyToken, createUsers);
router.put("/update/:userId",verifyToken, updateUser);
router.get("/get-user/:userId",verifyToken, getUserById);


module.exports = router;
