import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const ValidateAuthUser = async (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];

  if (!authHeader) {
    // Handle the case where the Authorization header is missing
    return res
      .status(401)
      .json({ error: "Authorization header missing", status: false });
  }
  const tokenParts = authHeader.split(" ");

  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    // Handle invalid token format
    return res
      .status(401)
      .json({ error: "Invalid token format", status: false });
  }
  const authToken = tokenParts[1]; // Extract the token part
  try {
    const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
    req.userId = decodedToken.userId;
    req.userRole = decodedToken.userRole;
    next();
  } catch (error) {
    if (error.message === "jwt expired") {
      return res.status(401).json({ error: "Token expired", status: false });
    }
    return res.status(500).json({
      error: "Please authenticate using a valid token",
      status: false,
    });
  }
};
