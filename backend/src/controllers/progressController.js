import Assignment from "../models/assignment.js";
import AssignmentSubmission from "../models/assignmentSubmission.js";
import Course from "../models/course.js";
import Student from "../models/student.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getStudentProgress = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { studentId } = req.params;
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const student = await Student.findById(studentId);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  if (!student.enrolledCourses.includes(courseId)) {
    throw new ApiError(403, "Student is not enrolled in courses");
  }

  const assignments = await Assignment.find({ course: courseId });
  const submission = await AssignmentSubmission.find({
    student: studentId,
    courses: courseId,
  });

  const progress = assignments.map((assign) => {
    const submitted = submission.find(
      (sub) => sub.assignment.toString() === assign._id.toString(),
    );

    return {
      assignmentId: assign._id,
      title: assign.title,
      submitted: !!submitted,
      submittedAt: submitted?.createdAt || null,
      status: submitted?.status || "Not Submitted",
      score: submitted?.score ?? null,
      file: submitted?.submittedFile || null,
    };
  });

  return res.status(200).json(
    new ApiResponse(200, "student progress fetched", {
      student: {
        fullName: student.fullName,
        email: student.email,
      },
      course: {
        title: course.title,
      },
      progress,
    }),
  );
});

export const getMyProgress = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const { courseId } = req.params;
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(401, "Course not found");
  }
  if (!studentId.enrolledCourses.includes(courseId)) {
    throw new ApiError(403, "Student is not enrolled in this course");
  }

  const assignments = await Assignment.find({ course: courseId });
  const submission = await AssignmentSubmission.find({
    student: studentId,
    courses: courseId,
  });

  const progress = assignments.map((assign) => {
    const submitted = submission.find(
      (sub) => sub.assignment.toString() === assign._id.toString(),
    );

    return {
      assignmentTitle: assign.title,
      submitted: !!submitted,
      submittedAt: submitted?.createdAt || null,
      status: submitted?.status,
      feedback: submitted.instructorFeedBack,
      score: submitted?.score ?? null,
    };
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      "getMyProgess fetched successfully",
      {
        course: {
          title: course.title,
        },
      },
      progress,
    ),
  );
});
