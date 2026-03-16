import { use } from "react";
import Course from "../models/course.js";
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
    console.log(user);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    console.log(accessToken);
    console.log(refreshToken);
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("eroor", error);
    throw new ApiError(500, "Error occured in a generateAccessAndRefreshToken");
  }
};

export const registerStudent = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone,role } = req.body;
  const image = req.file.filename;
  if (!fullName || !email || !password || !phone) {
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
    role:role,
    avatar: image,
  });

  const studentCreated = await Student.findById(student._id).select(
    "-password -refreshToken",
  );

  if (!studentCreated) {
    throw new ApiError(500, "Error occured when registering student");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
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
      new ApiResponse(200, "Student registered successfully", studentCreated),
    );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }
  const isExist = await Student.findOne({ email });

  if (!isExist) {
    throw new ApiError(404, "Student couldnot found please register !");
  }

  const isCorrectPassword = await isExist.isPasswordCorrect(password);
  if (!isCorrectPassword) {
    throw new ApiError(404, "Password is incoorect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    isExist._id,
  );

  const loggedInUser = await Student.findById(isExist._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
  };

  return res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .status(200)
    .json(new ApiResponse(200, "Student Login Successfully", loggedInUser));
});

export const logout = asyncHandler(async (req, res) => {
  const id = req.user._id;
  await Student.findByIdAndUpdate(
    id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logout successfully", {}));
}); 

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await Student.findById(id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "usernotfound");
  }

  return res.status(200).json(new ApiResponse(200, "User fetched"), user);
});

export const getMe = asyncHandler(async (req, res) => {
  const id = req.user._id;
  const user = await Student.findById(id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User nout found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Student profile fetched", user));
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const role = req.user.role;

  if (!["Instructor", "Admin"].includes(role)) {
    throw new ApiError(
      401,
      "This user are not authorized to access this material",
    );
  }

  if (role === "Instructor") {
    const courses = await Course.find({ instructor: role._id });

    if (!courses.length) {
      throw new ApiError(
        404,
        "There is no courses assigned to this instructor",
      );
    }

    const courseId = courses.map((course) => course._id);
    const students = await Student.find({
      role: "Student",
      enrolledCourses: { $in: courseId },
    }).select("fullName email phone avatar enrolledCourses");

    return (
      res.status(200),
      json(
        ApiResponse(
          200,
          students.length
            ? "Student fetched successfully"
            : "No students enrolled in your courses",
          students,
        ),
      )
    );
  }
 
  if (role == "Admin") {
    const user = await Student.find().select("-password");
    if (!user) {
      throw new ApiError(404, "No Admin found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Admin fethed successfully", user));
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { fullName, email, phone, role } = req.body;

  const idUpdate = await Student.findById(id);
  if (!idUpdate) {
    throw new ApiError(404, "Id could not found");
  }

  const isAdmin = req.user.role === "Admin";
  const selfUpdate = req.user._id.toString() === id;
  
  if(!isAdmin && !selfUpdate){
    throw new ApiError(401,"unauthorized to update profile");
  }

  const updateData={fullName, email, phone};

  if(role){
    if(!isAdmin){
        throw new ApiError(401,"Only admin is allowed to update role");
    }
    
    updateData.role=role;
  }

  const userUpdate=await Student.findByIdAndUpdate(id,updateData,{
    new:true
  });

  if(!userUpdate){
    throw new ApiError(401,"Failed to update User");
  }
});






