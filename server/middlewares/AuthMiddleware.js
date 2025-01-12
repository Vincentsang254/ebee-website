import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    const token = req.header("x-auth-token");
  
    if (!token) {
      return res.status(401).json({ status: false, message: "No token, authorization denied" });
    }
  
    try {
      const decoded = jwt.verify(token, "sangkiplaimportantkey");
  
      if (!decoded) {
        return res.status(401).json({ status: false, message: "Token is not valid" });
      }
  
      req.user = decoded;
      next();
    } catch (error) {
      console.error("JWT Error:", error);
      return res.status(401).json({ status: false, message: "Not authorized, please login" });
    }
  };
// Reusable Role Verification Middleware
export const verifyRoles = (role) => (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user && req.user.userType === role) {
        next();
      } else {
        res.status(403).json({ status: false, message: `Access denied. Must be ${role}.` });
      }
    });
  };


