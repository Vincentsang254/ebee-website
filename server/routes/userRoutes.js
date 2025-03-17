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
router.delete("/delete/:userId",deleteUser);
router.get("/get",getUsers);
router.post("/create",createUsers);
router.put("/update/:userId",updateUser);
router.get("/get/:userId",getUserById);


module.exports = router;
