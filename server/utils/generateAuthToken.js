// Import the jwt module using ES6 import syntax
import jwt from "jsonwebtoken";

// Function to generate authentication token
const generateAuthToken = (userId) => {
  // const secretKey = process.env.SECRET_KEY; //sangkiplaimportantkey

  // if (!secretKey) {
  //   throw new Error("JWT secret key is not defined");
  // }

  const token = jwt.sign(
    {
      userId,
    },
    "sangkiplaimportantkey", // Replace this with an environment variable for security in production
    {
      expiresIn: "60d",  // Token expires in 60 days
    }
  );
  return token;
};

// Export the function using ES6 export syntax
export default generateAuthToken;
