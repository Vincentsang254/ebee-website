const jwt = require("jsonwebtoken");
const { Users } = require("../models");

const verifyToken = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, "sangkiplaimportantkey");
            req.user = await Users.findByPk(decoded.id);

            if (!req.user) {
                console.log("User not found in the database");
                return res.status(401).json({ message: "User not found" });
            }
            next();
        } catch (error) {
            console.error("JWT Error: ", error);
            return res.status(401).json({ message: "Not authorized, please login" });
        }
    } else {
        console.log("No token provided");
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};

const verifyRoles = (...allowedRoles) => async (req, res, next) => {
    await verifyToken(req, res, async () => {
        if (req.user && req.user.userType) {
            if (allowedRoles.includes(req.user.userType)) {
                next();
            } else {
                console.log("Role not allowed");
                return res.status(403).json({ status: false, message: "Not allowed" });
            }
        } else {
            console.log("req.user or req.user.userType is undefined");
            return res.status(403).json({ status: false, message: "User information missing or invalid" });
        }
    });
};

module.exports = {
    verifyToken,
    verifyRoles,
};
