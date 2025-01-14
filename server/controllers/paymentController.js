/** @format */
// Middleware for generating the Daraja token
import axios from "axios";
import moment from "moment";
import Payments from "../models/Payment.js";
import cron from "node-cron";
import { Op } from "sequelize";


export const generateDarajaToken = async (req, res, next) => {
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
export const initiateSTKPush = async (req, res) => {
	try {
		const phone = req.body.phone.slice(1);
		const amount = req.body.amount;
		// const { phone, amount} = req.body

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
				PartyA: `254${phone}`,
				PartyB: shortcode,
				PhoneNumber: `254${phone}`,
				CallBackURL: "https://ebee-app.onrender.com/api/payment/process-callback",
				AccountReference: `254${phone}`,
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


export const processCallback = async (req, res) => {
  try {
    const callbackData = req.body;

    // Check if the callback data contains the necessary metadata
    if (!callbackData.Body.stkCallback.CallbackMetadata) {
      return res.status(200).json({ status: true, message: "Callback received successfully." });
    }

    const items = callbackData.Body.stkCallback.CallbackMetadata.Item;
    const paymentNumber = items[4]?.Value;  // The phone number of the payer
    const amount = items[0]?.Value;         // Amount paid
    const trnx_id = items[1]?.Value;        // Transaction ID
    const trnx_date = moment(items[3]?.Value).format("YYYY-MM-DD HH:mm:ss"); // Transaction date

    // Fetch user based on payment number
    let currentUser = req.user 

    if (!currentUser) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }

    currentUser.phone = paymentNumber;
    currentUser.amount = amount.toString();
    currentUser.trnx_id = trnx_id;
    currentUser.trnx_date = trnx_date;

   
  // Save payment details to the database
  const payment = await Payments.create({
    phone: paymentNumber,
    amount: amount.toString(),
    trnx_id,
    trnx_date,
    userId: req.body.userId, // Pass the userId from your request body
    orderId: req.body.orderId, // Pass the orderId from your request body
  });

    // Send response to confirm the processing
    res.status(200).json({
      status: true,
      message: "User data and payment details updated successfully",
    });


  } catch (error) {
    console.error("Error processing callback:", error.message);
    res.status(500).json({ status: false, message: error.message });
  }
};



