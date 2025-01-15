
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

// const { otpGenerate} = require("../util")

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const userAddressRoutes = require("./routes/userAddressRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const db = require("./models");

const app = express();

// Set up the port dynamically for production
const port = process.env.PORT || 3001;

// Check db object
console.log("db object", db);

// Ensure db.models exists before calling console.table
if (db.models) {
  console.table("db models", Object.entries(db.models));
} else {
  console.log("db.models is undefined or null");
}

app.use(cors({
  origin: process.env.CLIENT_URL || "https://ebee-app.onrender.com", // Use env var for production URL
  credentials: true,
}));

app.use(express.json()); // For parsing JSON bodies
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/address", userAddressRoutes);
app.use("/api/ratings", ratingRoutes);

app.get("/test", (req, res) => {
  res.status(200).json("Backend is working....");
});

const __dirname = path.resolve();

// Production settings to serve React frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

db.sequelize.sync().then(() => {
	app.listen(port, "0.0.0.0", () => {
		console.log(`Server running on http://localhost:${port}`);
	});
});