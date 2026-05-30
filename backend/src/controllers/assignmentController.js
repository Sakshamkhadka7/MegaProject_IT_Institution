import Assignment from "../models/assignment.js";
import AssignmentSubmission from "../models/assignmentSubmission.js";
import Course from "../models/course.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export const createAssignment = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const role = req.user.role;
  const instructorId = req.user._id;

  if (role != "Instructor") {
    throw new ApiError(401, "Not authorized to access this");
  }

  const { title, description, deadline } = req.body;

  if (!title || !description || !deadline) {
    throw new ApiError(401, "All fields are mandatory");
  }

  let fileUrl = null;

  // ---------------- CLOUDINARY UPLOAD ----------------
  if (req.file) {
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      "assignment-files",
      "auto"
    );

    fileUrl = uploadResult.secure_url;
  }

  if (!fileUrl) {
    throw new ApiError(401, "File is required");
  }

  const assignment = await Assignment.create({
    course: courseId,
    title,
    description,
    deadline,
    fileUrl,
    createdBy: instructorId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Assignment created successfully", assignment));
});

export const getAssignmentByCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.id;

  if (!courseId) {
    throw new ApiError(401, "Id couldnot found");
  }

  const course = await Course.findOne({
    _id: courseId,
    isDeleted: false,
  });

  if (!course) {
    throw new ApiError(404, "Course not found or deleted");
  }

  const assignmentCourse = await Assignment.find({
    course: courseId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      "AssignmentByCourse fetched",
      assignmentCourse
    )
  );
});

export const getInstructorAssignment = asyncHandler(async (req, res) => {
  const instructorId = req.user._id;

  // ONLY ACTIVE COURSES
  const courses = await Course.find({
    instructor: instructorId,
    isDeleted: false,
  });

  const courseIds = courses.map((c) => c._id);

  if (!courseIds.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, "No courses found", []));
  }

  const assignments = await Assignment.find({
    course: { $in: courseIds },
  }).populate({
    path: "course",
    match: { isDeleted: false },
    select: "title",
  });

  // REMOVE NULL COURSES
  const filteredAssignments = assignments.filter(
    (assignment) => assignment.course
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Assignments fetched",
      filteredAssignments
    )
  );
});

export const assignmentSubmission = asyncHandler(async (req, res) => {
  const assignmentId = req.params.id;

  if (!assignmentId) {
    throw new ApiError(401, "Id couldnot found");
  }

  const { courseId, comment } = req.body;
  const studentId = req.user._id;

  if (!courseId || !studentId) {
    throw new ApiError(401, "Id couldnot found");
  }

  if (!comment) {
    throw new ApiError(401, "Comment is required");
  }

  let submittedFile = null;

  if (req.file) {
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      "assignment-submissions",
      "auto"
    );

    submittedFile = uploadResult.secure_url;
  }

  if (!submittedFile) {
    throw new ApiError(401, "File is required");
  }

  const existingSubmission = await AssignmentSubmission.findOne({
    assignment: assignmentId,
    courses: courseId,
    student: studentId,
  });

  if (existingSubmission) {
    throw new ApiError(401, "Student has already submitted assignment");
  }

  const assignmentSubmission = await AssignmentSubmission.create({
    assignment: assignmentId,
    courses: courseId,
    student: studentId,
    submittedFile,
    comment,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Assignment submitted successfully",
        assignmentSubmission
      )
    );
});

export const getSubmittedAssignments = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const assignment = await AssignmentSubmission.find({
    student: studentId,
  })
    .populate({
      path: "courses",
      match: {
        isDeleted: false,
      },
    })
    .populate("assignment");

  // REMOVE NULL COURSES
  const filteredAssignments = assignment.filter(
    (item) => item.courses
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Submitted assignment fetched",
      filteredAssignments
    )
  );
});

export const deleteAssignment = asyncHandler(async (req, res) => {
  const assignmentId = req.params.id;
  if (!assignmentId) {
    throw new ApiError(401, "Id ouldnot found");
  }

  const assignment = await Assignment.findByIdAndDelete(assignmentId);
  if (!assignment) {
    throw new ApiError(401, "No assigmnet found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Assignment deleted successfully"));
});

// export const SubmittedAssignmentForInstructor = asyncHandler(
//   async (req, res) => {
//     const instructorId = req.user._id;
    
//     const instructor = req.user.role;
//     if (instructor !== "Instructor") {
//       throw new ApiError(401, "Not authorized to check assignment");
//     }
//     if (!instructorId) {
//       throw new ApiError(401, "Id coulnot found");
//     }

//     const courses = await Course.find({ instructor: instructorId });
//     if (courses.length == 0) {
//       throw new ApiError(401, "No courses is found for this instructor");
//     }

//     const courseId = await courses.map((course) => course._id);
    

//     const submission = await AssignmentSubmission.find({
//       courses: { $in: courseId },
//     })
//       .populate("courses")
//       .populate("student");

//     console.log(submission);

//     return res
//       .status(200)
//       .json(
//         new ApiResponse(200, "Assigment For Instructor is fetched", submission),
//       );
//   },
// );

export const SubmittedAssignmentForInstructor = asyncHandler(
  async (req, res) => {
    const instructorId = req.user._id;

    // ONLY ACTIVE COURSES
    const courses = await Course.find({
      instructor: instructorId,
      isDeleted: false,
    });

    const courseIds = courses.map((course) => course._id);

    if (!courseIds.length) {
      return res.status(200).json(
        new ApiResponse(200, "No courses found", [])
      );
    }

    const submission = await AssignmentSubmission.find({
      courses: { $in: courseIds },
    })
      .populate({
        path: "student",
        match: { isActive: true },
      })
      .populate({
        path: "courses",
        match: { isDeleted: false },
      })
      .populate("assignment");

    // REMOVE INVALID DATA
    const filteredSubmission = submission.filter(
      (item) =>
        item.student &&
        item.courses &&
        item.assignment
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Assignment fetched",
        filteredSubmission
      )
    );
  }
);
export const instructorFeedBack = asyncHandler(async (req, res) => {
  const submissionId = req.params.id;
  const { feedback, score } = req.body;
  console.log(feedback, score);

  const submission = await AssignmentSubmission.findById(submissionId);
  if (!submissionId) {
    throw new ApiError(401, "No submission found");
  }

  submission.status = "Reviewed";

  if (feedback) {
    submission.instructorFeedBack = feedback;
  }

  if (score !== undefined) {
    submission.score = Number(score);
  }

  await submission.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Instructor feedback has given", submission));
});
