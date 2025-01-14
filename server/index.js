import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import db from "./models/index.js";  // Ensure models are correctly imported

dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import userAddressRoutes from "./routes/userAddressRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";

const app = express();

// Set up the port dynamically for production
const port = process.env.PORT || 3001;

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
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/address", userAddressRoutes);
app.use("/api/ratings", ratingRoutes);

app.get("/test", (req, res) => {
  res.status(200).json("Backend is working.js");
});

const __dirname = path.resolve();

// Production settings to serve React frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

// Initialize models and sync the database
const startServer = async () => {
  try {
    // Sync the database without needing initializeModels()
    const res = await db.sequelize.sync();

    console.log("Database synced successfully:", res);

    // Start the server
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Error during initialization:", error);
    process.exit(1); // Exit with failure code if something goes wrong
  }
};

startServer();
