import Course from "../models/course.js";
import Student from "../models/student.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createCourse = asyncHandler(async (req, res) => {
  const instructor = req.user.role;
  const instructorId = req.user._id;
  if (!req.file) {
    throw new ApiError(400, "Course image is required");
  }
  const courseImage = req.file.filename;
  console.log(courseImage);

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
    !courseImage ||
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
    courseImage: courseImage,
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
  const courseImage = req.file.filename;

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
      courseImage: courseImage,
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
    new ApiResponse(200, "Course is deleted successfully", deleteCourseId),
  );
});

export const getAllCourse = asyncHandler(async (req, res) => {
  const course = await Course.find().populate("instructor", "fullName");
  if (!course.length) {
    throw new ApiError(401, "No courses found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "All courses fetched successfully", course));
});

export const getCourse = asyncHandler(async (req, res) => {
  const courseId = req.params;
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(401, "No course found");
  }
  return res.status.json(
    new ApiResponse(200, "Course fetched successfully", course),
  );
});

export const getMyCourse = asyncHandler(async (req, res) => {
  const student = req.user.role;
  const studentId = req.user._id;
  if (student == "Student") {
    const user = await Student.findById(studentId).populate("enrolledCourses");
    if (!user) {
      throw new ApiError(401, "No user found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "User Course fetched successfully",
          user.enrolledCourses,
        ),
      );
  }
});

export const enrolledCourse = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const courseId = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(401, "Course Id couldnot found");
  }
  const user = await user.findById(userId);
  if (!user) {
    throw new ApiError(401, "User couldnot found please register or login");
  }
  if (user.enrolledCourse.includes(courseId)) {
    throw new ApiError(401, "You are already enrolled in this courses");
  }

  user.enrolledCourse.push(courseId);
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "User enrolled successfully"));
});
