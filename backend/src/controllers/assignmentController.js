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
  const fileUrl = req.file;
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

  return res.status.json(
    new ApiResponse(200, "AssignnmentByCourse fetched", assignmentCourse),
  );
});

export const assignmentSubmission = asyncHandler(async (req, res) => {
  const assignmentId = req.body;
  if (!assignmentId) {
    throw new ApiError(401, "Id couldnot found");
  }

  const courseId = req.body;
  if (!courseId) {
    throw new ApiError(401, "Id couldnot found");
  }

  const studentId = req.user._id;

  if (!studentId) {
    throw new ApiError(401, "Id couldnot found");
  }

  const { comment, status } = req.body;
  const submittedFile = req.file;
  if (!submittedFile) {
    throw new ApiError(401, "File is required");
  }

  const existingSubmission = await AssignmentSubmission.findOne({
    assignment: assignmentId,
    course: courseId,
    student: studentId,
  });

  if (existingSubmission) {
    throw new ApiError(401, "Student has already submitted assignment");
  }

  const assignmentSubmission = await AssignmentSubmission({
    assignment: assignmentId,
    courses: courseId,
    student: studentId,
    submittedFile: submittedFile,
    comment: comment,
    status: status,
  });

  return res.status.json(
    new ApiResponse(
      200,
      "Assignment submitted successfully",
      assignmentSubmission,
    ),
  );
});

export const getSubmittedAssignments = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const assignment = await AssignmentSubmission.find({ student: studentId });
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
  return res.status.json(
    new ApiResponse(200, "Assignment deleted successfully"),
  );
});

export const SubmittedAssignmentForInstructor = asyncHandler(
  async (req, res) => {
    const instructorId = req.user._id;
    if (!instructorId) {
      throw new ApiError(401, "Id coulnot found");
    }

    const courses = await Course.find({ instructor: instructorId });
    if (courses.length == 0) {
      throw new ApiError(401, "No courses is found for this instructor");
    }

    const courseId = await courses.map((course) => course._id);

    const submission = await AssignmentSubmission.find({
      course: { $in: courseId },
    });

    return res.status(200).json(new ApiResponse(200,"Assigment For Instructor is fetched",submission))''
  },
);
