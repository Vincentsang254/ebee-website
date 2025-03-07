
const Users = require("../models/Users");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = req.headers["x-auth-token"];

  if (!token) {
    return res
      .status(403)
      .json({
        status: false,
        message: "Access denied. You must be authenticated. ",
      });
  }

  try {
    const decoded = jwt.verify(token, "sangkiplaimportantkey78");

    if (!decoded) {
      return res
        .status(401)
        .json({ status: false, message: "Token is not valid" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
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