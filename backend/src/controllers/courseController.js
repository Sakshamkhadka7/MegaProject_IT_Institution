import Course from "../models/course.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createCourse = asyncHandler(async (req, res) => {

  const instructor = req.user.role;
  const instructorId=req.user._id;
  console.log(req.user);

  if(instructor !== "Instructor"){
    throw new ApiError(401,"Unauthorized to access");
  }

    const {
    title,
    descriptions,
    syllabus,
    duration,
    fee,
    level,
    enrollmentDeadline,
    prerequisities,
  } = req.body;

  if (
    !title ||
    !descriptions ||
    !syllabus ||
    !duration ||
    !fee ||
    !enrollmentDeadline ||
    !instructor
  ) {
     throw new ApiError(401,"All fields are mandatory")
  }

  const course = await Course.create({
    title,
    descriptions,
    syllabus,
    duration,
    fee,
    instructor: instructorId,
    level,
    enrollmentDeadline,
    prerequisities,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Course created succesfullt", course));
});
