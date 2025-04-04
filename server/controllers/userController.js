const generateOtp = require("../utils/otpGenerator");
const { Users } = require("../models");
const bcryptjs = require("bcryptjs");

// TODO revisit createUsers
const createUsers = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    // Check if user already exists
    const user = await Users.findOne({ where: { email: email } });

    if (user) {
      return res.status(400).json({
        status: 400,
        message: "User already registered",
      });
    }

    // Hash the password and generate OTP
    const hashpass = await bcryptjs.hash(password, 10);
    const verificationCode = generateOtp();

    // Create new user
    await Users.create({ email, name, verificationCode, password: hashpass });

    // Return success message
    res.status(201).json({
      status: 201,
      message: "User created successfully",
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      status: 500,
      message: error.message, // Updated message
    });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
   
    await Users.destroy({
      where: {
        id: userId,
      },
    });

 
    res.status(200).json({
      status: 200,
      message: "User deleted successfully",
    });
  } catch (error) {
  
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.userId;
  const { email, name, password } = req.body;

  try {
  
    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

 
    await Users.update({ email, name, password }, { where: { id: userId } });


    res.status(200).json({
      status: 200,
      message: "User updated successfully",
    });
  } catch (error) {

    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {

    const users = await Users.findAll({
      attributes: {
        exclude: [
          "password",
          "verificationCode",
          "createdAt",
          "updatedAt",
        ],
      },
    });

    res.status(200).json({
      status: 200,
      data: users,
    });
  } catch (error) {

    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.userId;

  try {

    const user = await Users.findOne(
      { where: { id: userId } },
      {
        attributes: { exclude: ["password"] },
      }
    );

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }


    res.status(200).json({
      status: 200,
      data: user,
    });
  } catch (error) {
  
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

module.exports = {
  deleteUser,
  getUsers,
  createUsers,
  updateUser,
  getUserById,
};
