import Student from "../models/student.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await Student.findById(userId);
    if (!user) {
      throw new ApiError(404, "User Not Found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error occured in a generateAccessAndRefreshToken");
  }
};

export const registerStudent = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone } = req.body;
  const image = req.file;
  if (!fullName || !email || !password || phone) {
    throw new ApiError(400, "All fields are mandatory");
  }

  const isExists = await Student.findOne({ email });

  if (isExists) {
    throw new ApiError(409, "User already exists");
  }

  const student = await Student.create({
    fullName,
    email,
    phone,
    password,
    avatar: image,
  });

  const studentCreated = await Student.findById(student._id).select(
    "-password -refreshToken",
  );

  if (!studentCreated) {
    throw new ApiError(500, "Error occured when registering student");
  }
  const { accessToken, refreshToken } = generateAccessAndRefreshToken(
    studentCreated._id,
  );

  const options = {
    httpOnly: true,
  };

  return res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .status(201)
    .json(
      new ApiResponse(201, "Student registered successfully", studentCreated),
    );
});
