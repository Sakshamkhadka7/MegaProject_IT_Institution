import Assignment from "../models/assignment.js";
import AssignmentSubmission from "../models/assignmentSubmission.js";
import Course from "../models/course.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createAssignment = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const role = req.user.role;
  const instructorId = req.user._id;
  if (role != "Instructor") {
    throw new ApiError(401, "Not authorized to access this");
  }

  const { title, description, deadline } = req.body;
  const fileUrl = req.file.filename;
  if (!title || !description || !deadline || !fileUrl) {
    throw new ApiError(401, "All fields are mandatory");
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

  const assignmentCourse = await Assignment.find({ course: courseId });

  if (!assignmentCourse) {
    throw new ApiError(401, "Couldnot found a assignment by course");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "AssignnmentByCourse fetched", assignmentCourse),
    );
});

export const getInstructorAssignment = asyncHandler(async (req, res) => {

  const instructorId = req.user._id;

  const courses = await Course.find({ instructor: instructorId });

  const courseIds = courses.map(c => c._id);

  if (!courseIds.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, "No courses found", []));
  }

  const assignments = await Assignment.find({
    course: { $in: courseIds }
  }).populate("course", "title");

  return res.status(200).json(
    new ApiResponse(200, "Assignments fetched", assignments)
  );
});

export const assignmentSubmission = asyncHandler(async (req, res) => {
  const assignmentId = req.params.id;
  console.log(req.body);
  if (!assignmentId) {
    throw new ApiError(401, "Id couldnot found");
  }

  const { courseId } = req.body;
  if (!courseId) {
    throw new ApiError(401, "Id couldnot found");
  }

  const studentId = req.user._id;

  if (!studentId) {
    throw new ApiError(401, "Id couldnot found");
  }

  const { comment } = req.body;
  const submittedFile = req.file.filename;
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
    submittedFile: submittedFile,
    comment: comment,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Assignment submitted successfully",
        assignmentSubmission,
      ),
    );
});

export const getSubmittedAssignments = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const assignment = await AssignmentSubmission.find({
    student: studentId,
  }).populate("assignment");
  if (assignment.length == 0) {
    throw new ApiError(401, "No assignment has been submitted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Submitted assignment fetched", assignment));
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

export const SubmittedAssignmentForInstructor = asyncHandler(async (req, res) => {
  const instructorId = req.user._id;

  // 1. Get instructor courses (only active ones if needed)
  const courses = await Course.find({
    instructor: instructorId,
  });
  
  const courseIds = courses.map((course) => course._id);

  if (!courseIds.length) {
    return res.status(200).json(
      new ApiResponse(200, "No courses found", [])
    );
  }

  // 2. Fetch submissions
  const submission = await AssignmentSubmission.find({
    courses: { $in: courseIds },
  })
    .populate({
      path: "student",
      match: { isActive: true }, // soft delete filter
    })
    .populate("courses")
    .populate("assignment");

  // 3. IMPORTANT: remove invalid records safely
  const filteredSubmission = submission.filter(
    (item) =>
      item.student && // removes soft-deleted users
      item.assignment &&
      item.courses
  );

  return res.status(200).json(
    new ApiResponse(200, "Assignment fetched", filteredSubmission)
  );
});

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
