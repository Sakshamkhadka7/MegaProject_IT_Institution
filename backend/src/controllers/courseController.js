import cloudinary from "../config/cloudinary.js";
import Course from "../models/course.js";
import Lecture from "../models/lecture.js";
import Student from "../models/student.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import { getStudentProgress } from "./progressController.js";
import { uploadVideoToCloudinary } from "./videoController.js";

import streamifier from "streamifier";

export const createCourse = asyncHandler(async (req, res) => {
  const instructor = req.user.role;

  const instructorId = req.user._id;

  if (instructor !== "Instructor") {
    throw new ApiError(401, "Unauthorized to access");
  }

  if (!req.file) {
    throw new ApiError(400, "Course image is required");
  }

  let {
    title,
    description,
    syllabus,
    duration,
    fee,
    level,
    enrollmentDeadline,
    prerequisites,
  } = req.body;

  let parsedSyllabus = [];

  if (Array.isArray(syllabus)) {
    parsedSyllabus = syllabus;
  } else if (typeof syllabus === "string") {
    try {
      parsedSyllabus = JSON.parse(syllabus);
    } catch (error) {
      throw new ApiError(400, "Invalid syllabus format");
    }
  }

  if (
    !title ||
    !description ||
    !parsedSyllabus.length ||
    !duration ||
    !fee ||
    !enrollmentDeadline
  ) {
    throw new ApiError(400, "All fields are mandatory");
  }

  const uploadImage = () => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "lms-course-images",
        },

        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });
  };

  const cloudinaryResult = await uploadImage();

  const course = await Course.create({
    title,
    description,
    syllabus: parsedSyllabus,
    duration,
    fee,
    instructor: instructorId,
    level,
    enrollmentDeadline,
    prerequisites,
    thumbnail: cloudinaryResult.secure_url,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Course created successfully", course));
});

export const updateCourse = asyncHandler(async (req, res) => {
  const role = req.user?.role;

  if (role !== "Instructor" && role !== "Admin") {
    throw new ApiError(401, "Unauthorized to access");
  }
  
  const id = req.params.id;

  if (!id) {
    throw new ApiError(401, "Id couldnot found");
  }

  const courseExist = await Course.findById(id);

  if (!courseExist) {
    throw new ApiError(401, "Course doesnot exists");
  }

  const {
    title,
    description,
    duration,
    fee,
    level,
    enrollmentDeadline,
    prerequisites,
  } = req.body;

  let parsedSyllabus = [];

  if (req.body.syllabus) {
    parsedSyllabus = JSON.parse(req.body.syllabus);
  }

  const updateData = {
    title,
    description,
    syllabus: parsedSyllabus,
    duration,
    fee,
    level,
    enrollmentDeadline,
    prerequisites,
  };

  if (req.file) {
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      "course-images",
      "image"
    );

    updateData.thumbnail =
      uploadResult.secure_url;
  }

  const updateCourse = await Course.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Course updated successfully",
      updateCourse
    )
  );
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

  return res
    .status(200)
    .json(new ApiResponse(200, "Course deleted successfully"));
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

  return res
    .status(200)
    .json(new ApiResponse(200, "All courses fetched successfully", course));
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

  if (courses.length == 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(401, "No courses has been added by this instructor"),
      );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Instructor courses has been fetched", courses));
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
    const user = await Student.findById(studentId).populate({
      path: "enrolledCourses",
      match: {
        isDeleted: false,
      },
    });

    if (!user) {
      throw new ApiError(401, "No user found");
    }

    // REMOVE NULL COURSES
    const filteredCourses = user.enrolledCourses.filter(
      (course) => course !== null,
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Student Course fetched successfully",
          filteredCourses,
        ),
      );
  }
});

export const addLecture = asyncHandler(async (req, res) => {
  const instructorId = req.user._id;

  const { courseId } = req.params;

  const { title, description, lectureOrder, isPreviewFree } = req.body;

  const course = await Course.findById(courseId);

  if (!course) {
    return res.status(404).json({
      message: "Course not found",
    });
  }

  if (course.instructor.toString() !== instructorId.toString()) {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      message: "Video is required",
    });
  }

  const uploadedVideo = await uploadVideoToCloudinary(req.file.buffer);

  const lecture = await Lecture.create({
    course: courseId,
    title,
    description,
    videoUrl: uploadedVideo.secure_url,
    publicId: uploadedVideo.public_id,
    duration: uploadedVideo.duration,
    thumbnail: uploadedVideo.secure_url,
    lectureOrder,
    isPreviewFree,
    createdBy: instructorId,
  });

  course.totalLectures += 1;

  await course.save();

  return res
    .status(201)
    .json(new ApiResponse(201, "Successfully added lecture", lecture));
});

export const getSingleCourseWithLectures = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  if (!courseId) {
    throw new ApiError(400, "Course Id is required");
  }

  const course = await Course.findOne({
    _id: courseId,
    isDeleted: false,
  }).populate({
    path: "instructor",
    select: "fullName email",
  });
  console.log(course);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const lectures = await Lecture.find({
    course: courseId,
    isDeleted: false,
  }).sort({
    lectureOrder: 1,
  });
  console.log(lectures);

 return res.status(200).json({ success: true, course, lectures, });
});

export const deleteLecture = asyncHandler(async (req, res) => {
  const { lectureId } = req.params;

  const lecture = await Lecture.findById(lectureId);

  if (!lecture) {
    throw new ApiError(404, "Lecture not found");
  }

  lecture.isDeleted = true;

  await lecture.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Lecture deleted successfully"));
});

export const getInstructorLectures = asyncHandler(async (req, res) => {
  const instructorId = req.user._id;
  const role = req.user.role;

  if (role !== "Instructor") {
    throw new ApiError(401, "Unauthorized to access");
  }

  const courses = await Course.find({
    instructor: instructorId,
    isDeleted: false,
  }).select("title thumbnail");

  if (!courses.length) {
    return res.status(200).json(new ApiResponse(200, "No courses found", []));
  }

  const groupedLectures = await Promise.all(
    courses.map(async (course) => {
      const lectures = await Lecture.find({
        course: course._id,
        isDeleted: false,
      })
        .sort({
          lectureOrder: 1,
        })
        .select(
          `
            title
            description
            videoUrl
            thumbnail
            duration
            lectureOrder
            isPreviewFree
            createdAt
          `,
        );

      return {
        courseId: course._id,
        courseTitle: course.title,
        courseThumbnail: course.thumbnail,
        totalLectures: lectures.length,
        lectures,
      };
    }),
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Instructor lectures fetched successfully",
        groupedLectures,
      ),
    );
});

export const updateLecture = asyncHandler(async (req, res) => {
  const { lectureId } = req.params;

  const instructorId = req.user._id;

  const role = req.user.role;

  if (role !== "Instructor") {
    throw new ApiError(401, "Unauthorized to access");
  }

  const lecture = await Lecture.findOne({
    _id: lectureId,
    isDeleted: false,
  });

  if (!lecture) {
    throw new ApiError(404, "Lecture not found");
  }

  if (lecture.createdBy.toString() !== instructorId.toString()) {
    throw new ApiError(403, "You can only update your own lectures");
  }

  const { title, description, lectureOrder, isPreviewFree } = req.body;

  if (title) {
    lecture.title = title;
  }

  if (description) {
    lecture.description = description;
  }

  if (lectureOrder !== undefined) {
    lecture.lectureOrder = lectureOrder;
  }

  if (isPreviewFree !== undefined) {
    lecture.isPreviewFree = isPreviewFree;
  }

  if (req.file) {
    const uploadedVideo = await uploadVideoToCloudinary(req.file.buffer);

    const oldPublicId = lecture.publicId;

    lecture.videoUrl = uploadedVideo.secure_url;

    lecture.publicId = uploadedVideo.public_id;

    lecture.duration = uploadedVideo.duration;

    lecture.thumbnail = uploadedVideo.secure_url;

    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId, {
        resource_type: "video",
      });
    }
  }

  lecture.updatedBy = instructorId;

  await lecture.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Lecture updated successfully", lecture));
});

export const enrolledCourse = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const courseId = req.params.courseId;

  const course = await Course.findOne({
    _id: courseId,
    isDeleted: false,
  });

  if (!course) {
    throw new ApiError(404, "Course not found or deleted");
  }

  const user = await Student.findById(userId);

  if (!user) {
    throw new ApiError(401, "User couldnot found");
  }

  if (user.enrolledCourses.includes(courseId)) {
    return res
      .status(200)
      .json(new ApiResponse(200, "User already enrolled in this course"));
  }

  user.enrolledCourses.push(courseId);

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "User enrolled successfully"));
});
