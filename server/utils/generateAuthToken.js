// Import the jwt module using ES6 import syntax
import jwt from "jsonwebtoken";

// Function to generate authentication token
const generateAuthToken = (user) => {
  

  const token = jwt.sign(
    {
      id: user.id,
        userType: user.userType,
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
        verified: user.verified
    },
    "sangkiplaimportantkey78", 
    {
      expiresIn: "60d",  
    }
  );
  return token;
};

export default generateAuthToken;
