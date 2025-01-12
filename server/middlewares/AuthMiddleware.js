import Users from "../models/Users.js";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ status: false, message: "No token, authorization denied" });
  }

  // Extract the token by removing the "Bearer" prefix
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  try {
    const decoded = jwt.verify(token, "sangkiplaimportantkey");

    if (!decoded) {
      return res.status(401).json({ status: false, message: "Token is not valid" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Error:", error);
    res.status(401).json({ status: false, message: "Not authorized, please login" });
  }
};


export const isClient = (req, res, next) => {
  const userId = req.user.id;
  const paramId = req.params.id;

  if (userId === paramId || req.user.admin) {
    next();
  } else {
    res.status(403).json({ status: false, message: "Access denied. Not authorized..." });
  }
};


// Reusable Role Verification Middleware
export const verifyRoles = (role) => (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.userType === role) {
      next();
    } else {
      res.status(403).json({ status: false, message: `Access denied. You must be ${role}.` });
    }
  });
};
