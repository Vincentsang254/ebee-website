/** @format */
// Middleware for generating the Daraja token
import axios from "axios";
import moment from "moment";
import Payments from "../models/Payment.js";
import cron from "node-cron";
import { Op } from "sequelize";

const generateDarajaToken = async (req, res, next) => {
	try {
		const consumer = "mJBID5vnbx55DAODHtaHn8z0c37NoT8lQAZTTc1eYKd79WLW";
		const secret =
			"fxoL43QW45xYytkpVLMJKyObv7SJAbbOWAzOilkeW5XGrsYEAZbZeEUBKZ2DO8ws";

		const auth = Buffer.from(`${consumer}:${secret}`).toString("base64");

		const response = await axios.get(
			"https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
			{
				headers: {
					Authorization: `Basic ${auth}`,
				},
			}
		);

		const token = response.data.access_token;

		req.token = token

		console.table(token);

		// return token;

        
		next();
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
// Function to initiate STK Push
const initiateSTKPush = async (req, res) => {
	try {
		// const phone = req.body.phone;
		// const amount = req.body.amount;
		const { phone, amount} = req.body

		const token = req.token;

		const timestamps = moment().format("YYYYMMDDHHmmss");
		const shortcode = "174379";
		const passkey =
			"bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";

		const password = Buffer.from(
			`${shortcode}${passkey}${timestamps}`
		).toString("base64");

		const response = await axios.post(
			"https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
			{
				BusinessShortCode: shortcode,
				Password: password,
				Timestamp: timestamps,
				TransactionType: "CustomerPayBillOnline",
				Amount: amount,
				PartyA: phone,
				PartyB: shortcode,
				PhoneNumber: phone,
				CallBackURL: "https://monster-client.onrender.com/api/payment/sang2222",
				AccountReference: phone,
				TransactionDesc: "Payment for goods/services",
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		res.status(200).json({
			status: true,
			data: response.data,
			message: "STK Push sent successfully. Check your phone.",
		});
	} catch (error) {
		res.status(500).json({ status: false, message: error.message });
	}
};

// Function to process callback
const processCallback = async (req, res) => {
	try {
		const callbackData = req.body;

		if (!callbackData.Body.stkCallback.CallbackMetadata) {
			return res
				.status(200)
				.json({status: true, message: "Callback received successfully." });
		}

		const items = callbackData.Body.stkCallback.CallbackMetadata.Item;
		const paymentNumber = items[4]?.Value;
		const amount = items[0]?.Value;
		const trnx_id = items[1]?.Value;
		const trnx_date = moment(items[3]?.Value).format("YYYY-MM-DD HH:mm:ss");

		// // Fetch user based on payment number
		// let currentUser = await Users.findOne({
		// 	where: { phoneNumber: paymentNumber },
		// });

		let currentUser = req.user

		console.table({
			"Logged in user": currentUser
		});

		if (!currentUser) {
			return res.status(404).json({
				status: false,
				message: "User not found for the payment number",
			});
		}

		// Update user details based on the amount paid
		if (amount == 1) {
			currentUser.userType = "vipOne";
			currentUser.accessExpiration = new Date(
				Date.now() + 3 * 24 * 60 * 60 * 1000
			);
		} else if (amount == 2) {
			currentUser.userType = "vipTwo";
			currentUser.accessExpiration = new Date(
				Date.now() + 7 * 24 * 60 * 60 * 1000
			);
		} else if (amount == 3) {
			currentUser.userType = "vipThree";
			currentUser.accessExpiration = new Date(
				Date.now() + 30 * 24 * 60 * 60 * 1000
			);
		}

		// Save additional transaction details
		const userUpdateData = {
			phone: paymentNumber,
			userType: currentUser.userType,
			accessExpiration: currentUser.accessExpiration,
			amount: amount,
			transactionId: trnx_id,
			transactionDate: trnx_date,
		};
	    await currentUser.update(userUpdateData);


		res.status(200).json({
			status: true,
			message: "User data updated successfully",
		});

		// Schedule a job to run every minute and check for expired users
cron.schedule("* * * * *", async () => {
	try {
	  const expiredUsers = await Users.findAll({
		where: {
		  accessExpiration: { [Op.lte]: new Date() },
		},
	  });
  
	  for (const user of expiredUsers) {
		await Users.update(
		  { userType: "client" },
		  { where: { id: user.id } }
		);
		console.log(`User ${user.id} has been reset to 'client'.`);
	  }
	} catch (error) {
	  res.status(500).json({ status: false, message: error.message });
	}
  });

	} catch (error) {
		res.status(500).json({ status: false, message: error.message });
	}
};

export { generateDarajaToken, processCallback, initiateSTKPush };


