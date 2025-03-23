/** @format */

const { UserAddress } = require("../models");

const createAddress = async (req, res) => {
  const { name, email, county, phone, postalCode, userId } = req.body;

  try {
    // Check if the user already has an address
    const existingAddress = await UserAddress.findOne({ where: { userId } });

    if (existingAddress) {
      return res.status(400).json({
        status: false,
        message: "User already has an address",
      });
    }

    // Create a new address
    const newUserAddress = await UserAddress.create({
      name,
      email,
      county,
      phone,
      postalCode,
      userId,
    });

    res.status(201).json({
      status: true,
      message: "Address added successfully",
      data: newUserAddress,
    });
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateUserAddress = async (req, res) => {
  const { addressId } = req.params;
  const { name, email, county, phone, postalCode } = req.body;

  try {
    const userAddress = await UserAddress.findByPk(addressId);

    if (!userAddress) {
      return res.status(404).json({
        status: false,
        message: "User address not found",
      });
    }

    // Update the address fields correctly
    userAddress.county = county;
    userAddress.phone = phone;
    userAddress.postalCode = postalCode;
    userAddress.name = name;

    if (email) userAddress.email = email; // Update email if provided

    await userAddress.save();

    res.status(200).json({
      status: true,
      message: "Address updated successfully",
      data: userAddress,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

const getUserAddress = async (req, res) => {
  const userId = req.user?.id || req.params.userId; // Use authentication or fallback

  try {
    const userAddresses = await UserAddress.findAll({ where: { userId } });

    res.status(200).json({
      status: true,
      data: userAddresses,
    });
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

const deleteAddress = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id || req.params.userId; // Use authenticated user

  try {
    const userAddress = await UserAddress.findOne({ where: { id, userId } });

    if (!userAddress) {
      return res.status(404).json({
        status: false,
        message: "Address not found",
      });
    }

    await userAddress.destroy();

    res.status(200).json({
      status: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user address:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createAddress,
  updateUserAddress,
  getUserAddress,
  deleteAddress,
};
