
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

module.exports = generateDarajaToken;