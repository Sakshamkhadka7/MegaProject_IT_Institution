import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import Student from "../models/student.js";

const userMiddleware = async (req, res, next) => {
  const token = req.cookies.accessToken;
  
  if (!token) {
    throw new ApiError(401, "Cookies not found please register or login first");
  }

  const verifyCookie = jwt.verify(token, process.env.ACCESS_TOKEN);
  if (!verifyCookie) {
    throw new ApiError(401, "Cookies not matched");
  }

  const user = await Student.findById({ _id: verifyCookie._id }).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(401, "User not found by cookies");
  }

  req.user = user;
  next();
};

export default userMiddleware;
