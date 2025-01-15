/** @format */

const UserAddress = require("../models/UserAddress");

const createAddress = async (req, res) => {
	const { firstName, lastName, addressLine, country, city, phone, postalCode } = req.body;
	const userId = req.user.id;

	try {
		// Check if the user already has an address
		const existingAddress = await UserAddress.findOne({ where: { userId } });

		if (existingAddress) {
			return res.status(400).json({
				status: 400,
				message: "User already has an address"
			});
		}

		// Create a new address for the user
		const newUserAddress = await UserAddress.create({
			firstName,
			lastName,
			addressLine,
			country,
			city,
			phone,
			postalCode,
			userId,
		});

		// Return success response
		res.status(200).json({
			status: 200,
			message: "Address added successfully",
			data: newUserAddress
		});
	} catch (error) {
		// Handle any unexpected errors
		console.error("Error creating address:", error);
		res.status(500).json({
			status: 500,
			message: error.message  // Using error.message here
		});
	}
};


const updateUserAddress = async (req, res) => {
	const addressId = req.params.id;
	const { addressLine, country, city, phone, postalCode, firstName, lastName } = req.body;

	try {
		// Find the address by its ID
		const userAddress = await UserAddress.findByPk(addressId);

		if (!userAddress) {
			return res.status(404).json({
				status: 404,
				message: "User address not found"
			});
		}

		// Update the address fields
		userAddress.addressLine = addressLine;
		userAddress.country = country;
		userAddress.city = city;
		userAddress.phone = phone;
		userAddress.postalCode = postalCode;
		userAddress.firstName = firstName;
		userAddress.lastName = lastName;

		// Save the updated address
		await userAddress.save();

		// Return success response
		res.status(200).json({
			status: 200,
			message: "Address updated successfully",
			data: userAddress
		});
	} catch (error) {
		// Handle any unexpected errors
		console.error("Error updating address:", error);
		res.status(500).json({
			status: 500,
			message: error.message  // Using error.message here
		});
	}
};


const getUserAddress = async (req, res) => {
	const userId = req.user.id;

	try {
		// Fetch all addresses for the user
		const userAddresses = await UserAddress.findAll({
			where: { userId }
		});

		// Return the list of addresses
		res.status(200).json({
			status: 200,
			data: userAddresses
		});
	} catch (error) {
		// Handle any unexpected errors
		console.error("Error fetching user addresses:", error);
		res.status(500).json({
			status: 500,
			message: error.message  // Using error.message here
		});
	}
};

module.exports = {
    createAddress,
  updateUserAddress,
  getUserAddress
}