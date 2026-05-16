import Course from "../models/course.js";
import Student from "../models/student.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getStudentProgress } from "./progressController.js";

export const createCourse = asyncHandler(async (req, res) => {
  const instructor = req.user.role;
  const instructorId = req.user._id;

  if (instructor !== "Instructor") {
    throw new ApiError(401, "Unauthorized to access");
  }

  if (!req.file) {
    throw new ApiError(400, "Course image is required");
  }

  const courseImage = req.file.filename;

  let {
    title,
    descriptions,
    syllabus,
    duration,
    fee,
    level,
    enrollmentDeadline,
    prerequisities,
  } = req.body;


  let parsedSyllabus;

  if (Array.isArray(syllabus)) {
    // already array (best case)
    parsedSyllabus = syllabus;
  } else if (typeof syllabus === "string") {
    try {
      parsedSyllabus = JSON.parse(syllabus);
    } catch (err) {
      throw new ApiError(400, "Invalid syllabus format");
    }
  } else {
    parsedSyllabus = [];
  }

  
  if (
    !title ||
    !descriptions ||
    !parsedSyllabus.length ||
    !duration ||
    !fee ||
    !enrollmentDeadline
  ) {
    throw new ApiError(400, "All fields are mandatory");
  }

  const course = await Course.create({
    title,
    descriptions,
    syllabus: parsedSyllabus,
    duration,
    fee,
    instructor: instructorId,
    level,
    enrollmentDeadline,
    courseImage,
    prerequisities,
  });

  return res.status(201).json(new ApiResponse(200,"Course created successfully",course));
});

export const updateCourse = asyncHandler(async (req, res) => {
  const role = req.user?.role;
  if (role !== "Instructor" && role !=="Admin") {
    throw new ApiError(401, "Unauthorized to access");
  }
  const id = req.params.id;
  //  const courseImage = req.file ? req.file.filename : undefined;
  if (!id) {
    throw new ApiError(401, "Id couldnot found");
  }
  const courseExist = await Course.findById(id);
  if (!courseExist) {
    throw new ApiError(401, "Course doesnot exists");
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
  let courseImage;
  if (req.file) {
    courseImage = req.file.filename;
  }

  const updateData = {
    title,
    descriptions,
    syllabus,
    duration,
    fee,
    level,
    enrollmentDeadline,
    prerequisities,
  };

  if (courseImage) {
    updateData.courseImage = courseImage;
  }

  const updateCourse = await Course.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Course updated successfully", updateCourse));
});

// export const deleteCourse = asyncHandler(async (req, res) => {
//   const role = req.user?.role;
//   console.log(role);
//   if (role !== "Instructor" && role!=="Admin") {
//     throw new ApiError(401, "Unauthorized to access");
//   }
//   const id = req.params.id;
//   if (!id) {
//     throw new ApiError(401, "Id couldnot found");
//   }

//   const deleteCourseId = await Course.findByIdAndDelete({ _id: id });

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(200, "Course is deleted successfully", deleteCourseId),
//     );
// });

export const deleteCourse = asyncHandler(async (req, res) => {

  const role = req.user?.role;

  if (role !== "Instructor" && role !== "Admin") {
    throw new ApiError(401, "Unauthorized to access");
  }

  const id = req.params.id;

  if (!id) {
    throw new ApiError(401, "Id couldnot found");
  }

  const course = await Course.findById(id);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

 
  course.isDeleted = true;

  await course.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      "Course deleted successfully"
    )
  );
});



// export const getAllCourse = asyncHandler(async (req, res) => {
//   const course = await Course.find().populate("instructor", "fullName");
//   if (!course.length) {
//     throw new ApiError(401, "No courses found");
//   }
//   return res
//     .status(200)
//     .json(new ApiResponse(200, "All courses fetched successfully", course));
// });

export const getAllCourse = asyncHandler(async (req, res) => {

  const course = await Course.find({
    isDeleted: false,
  }).populate("instructor", "fullName");

  if (!course.length) {
    throw new ApiError(401, "No courses found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      "All courses fetched successfully",
      course
    )
  );
});


// export const getInstructorCourse = asyncHandler(async (req, res) => {
//   const user = req.user._id;
//   if (!user) {
//     throw new ApiError(401, "No user Id is found");
//   }

//   const courses = await Course.find({ instructor: user });
//   if (!courses) {
//     return new ApiResponse(200, "No courses you have created");
//   }

//   return res.status(200).json(new ApiResponse(200,"Instructor courses has been fetced",courses));
// });

export const getInstructorCourse = asyncHandler(async (req, res) => {

  const user = req.user._id;

  if (!user) {
    throw new ApiError(401, "No user Id is found");
  }

  const courses = await Course.find({
    instructor: user,
    isDeleted: false,
  });

  if(courses.length==0){
    return res.status(200).json(new ApiResponse(401,"No courses has been added by this instructor"))
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      "Instructor courses has been fetched",
      courses
    )
  );
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

// export const getMyCourse = asyncHandler(async (req, res) => {
//   const student = req.user.role;
//   const studentId = req.user._id;
//   console.log(studentId);
//   if (student == "Student") {
//     const user = await Student.findById(studentId).populate("enrolledCourses");
//     if (!user) {
//       throw new ApiError(401, "No user found");
//     }

//     return res
//       .status(200)
//       .json(
//         new ApiResponse(
//           200,
//           "Student Course fetched successfully",
//           user.enrolledCourses,
//         ),
//       );
//   }
// });

// export const enrolledCourse = asyncHandler(async (req, res) => {
//   const userId = req.user._id;
//   const courseId = req.params.courseId;

//   const course = await Course.findById(courseId);
//   if (!course) {
//     throw new ApiError(401, "Course Id couldnot found");
//   }
//   const user = await Student.findById(userId);
//   if (!user) {
//     throw new ApiError(401, "User couldnot found please register or login");
//   }
//   if (user.enrolledCourses.includes(courseId)) { 

//    return res
//     .status(200)
//     .json(new ApiResponse(200, "User already enrolled in this course"));
//   }

//   user.enrolledCourses.push(courseId);
//   await user.save();
//   return res
//     .status(200)
//     .json(new ApiResponse(200, "User enrolled successfully"));
// });

export const getMyCourse = asyncHandler(async (req, res) => {

  const student = req.user.role;

  const studentId = req.user._id;

  if (student === "Student") {

    const user = await Student.findById(studentId)
      .populate({
        path: "enrolledCourses",
        match: {
          isDeleted: false,
        },
      });

    if (!user) {
      throw new ApiError(401, "No user found");
    }

    // REMOVE NULL COURSES
    const filteredCourses =
      user.enrolledCourses.filter(
        (course) => course !== null
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Student Course fetched successfully",
        filteredCourses
      )
    );
  }
});


export const enrolledCourse = asyncHandler(async (req, res) => {

  const userId = req.user._id;

  const courseId = req.params.courseId;

  const course = await Course.findOne({
    _id: courseId,
    isDeleted: false,
  });

  if (!course) {
    throw new ApiError(
      404,
      "Course not found or deleted"
    );
  }

  const user = await Student.findById(userId);

  if (!user) {
    throw new ApiError(
      401,
      "User couldnot found"
    );
  }

  if (user.enrolledCourses.includes(courseId)) {
    return res.status(200).json(
      new ApiResponse(
        200,
        "User already enrolled in this course"
      )
    );
  }

  user.enrolledCourses.push(courseId);

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      "User enrolled successfully"
    )
  );
});