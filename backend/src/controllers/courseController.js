import Course from "../models/course.js";
import Student from "../models/student.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createCourse = asyncHandler(async (req, res) => {
  const instructor = req.user.role;
  const instructorId = req.user._id;
  console.log(req.user);

  if (instructor !== "Instructor") {
    throw new ApiError(401, "Unauthorized to access");
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
    throw new ApiError(401, "All fields are mandatory");
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

export const updateCourse = asyncHandler(async (req, res) => {
  const role = req.user?.role;
  if (role !== "Instructor") {
    throw new ApiError(401, "Unauthorized to access");
  }
  const id = req.params.id;
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

  if (!id) {
    throw new ApiError(401, "Id couldnot found");
  }

  const courseExist = await Course.find({ _id: id });
  if (!courseExist) {
    throw new ApiError(401, "Course doesnot exists");
  }

  const updateCourse = await Course.findByIdAndUpdate(
    id,
    {
      title,
      descriptions,
      syllabus,
      duration,
      fee,
      level,
      enrollmentDeadline,
      prerequisities,
    },
    {
      new: true,
    },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Course updated successfully", updateCourse));
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const role = req.user?.role;
  if (role !== "Instructor") {
    throw new ApiError(401, "Unauthorized to access");
  }
  const id = req.params.id;
  if (!id) {
    throw new ApiError(401, "Id couldnot found");
  }

  const deleteCourseId = await Course.findByIdAndDelete({ _id: id });

  return res.status.json(
    new ApiResponse(200, "Course is deleted successfully", deleteCourse),
  );
});

// export const studentProgress = asyncHandler(async (req, res) => {
//   const role = req.user?.role;
//   if (role !== "Instructor") {
//     throw new ApiError(401, "Unauthorized to access");
//   }
 
//   const instructorId=req.user?._id;

//   const courseCreated=await Course.find({instructor:instructorId});


  


// });
