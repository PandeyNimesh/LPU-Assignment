import { AsyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const authorizedUser = AsyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer ", "");
    console.log("token:", token);

    if (!token) {
      throw new ApiError(401, "Unauthorized user - No token provided");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SCREAT);
    const user = await User.findById(decodedToken?._id).select("-password -RefreshToken");

    if (!user) {
      throw new ApiError(401, "Unauthorized user - Invalid AccessToken");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Error:", error); // Log the error for debugging
    throw new ApiError(401, error?.message || "Invalid AccessToken");
  }
});


export { authorizedUser};