
const Users = require("../models/Users");
const jwt = require("jsonwebtoken");

// // const Users = require("../models/Users");
// const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = req.headers["x-auth-token"];

  if (!token) {
    return res.status(403).json({
      status: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, "sangkiplaimportantkey78");

    console.log("Decoded Token:", decoded); // ✅ Debugging

    if (!decoded || !decoded.id) {
      return res.status(401).json({ status: false, message: "Token is not valid" });
    }

    // ✅ Fetch the full user details from DB
    const user = await Users.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    req.user = user; // ✅ Attach full user object to `req.user`
    next();
  } catch (error) {
    return res.status(401).json({ status: false, message: "Invalid or expired token" });
  }
};



const verifyTokenAndAuthorization =
  (allowedRoles) =>{
    return (req, res, next) => {
      try {
        const userType = req.user?.userType

        if(!userType){
          return res.status(403).json({status: false, message: "Access denied. No user provided."})
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(userType)) {
          return res
            .status(403)
            .json({
              status: false,
              message: "You are not allowed to access this resource",
            });
        } 

        next()
      } catch (error) {
        
      }
    }
  }

module.exports = { verifyToken, verifyTokenAndAuthorization };