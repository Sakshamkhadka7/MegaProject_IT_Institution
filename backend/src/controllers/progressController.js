import Assignment from "../models/assignment.js";
import AssignmentSubmission from "../models/assignmentSubmission.js";
import Course from "../models/course.js";
import Lecture from "../models/lecture.js";
import Student from "../models/student.js";
import VideoProgress from "../models/videoProgressSchema.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getStudentProgress = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { studentId } = req.params;
  console.log(courseId,studentId);
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
  }).populate("assignment");

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


export const getStudentVideoProgress = asyncHandler(async (req, res) => {

  const { courseId, studentId } = req.params;

  if (!courseId || !studentId) {
    throw new ApiError(400, "Course ID and Student ID are required");
  }

  // get all lectures
  const lectures = await Lecture.find({
    course: courseId,
  });

  if (!lectures.length) {
    return res.status(200).json(
      new ApiResponse(200, "No lectures found", {
        totalLectures: 0,
        completedLectures: 0,
        progressPercentage: 0,
        completedLectureIds: [],
      })
    );
  }

  const totalLectures = lectures.length;

  // get student progress
  const progressRecords = await VideoProgress.find({
    student: studentId,
    course: courseId,
    isCompleted: true,
  });

  const completedLectureIds = progressRecords.map(
    (p) => p.lecture.toString()
  );

  const completedLectures = progressRecords.length;

  const progressPercentage = Math.round(
    (completedLectures / totalLectures) * 100
  );

  return res.status(200).json(
    new ApiResponse(200, "Student video progress fetched", {
      courseId,
      studentId,
      totalLectures,
      completedLectures,
      progressPercentage,
      completedLectureIds,
    })
  );
});

export const getMyProgress = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  // console.log(studentId);
  const { courseId } = req.params;
  // console.log(courseId);
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(401, "Course not found");
  }

  const student = await Student.findById(studentId);
  if (!student) {
    throw new ApiError(404, "Student donot found");
  }

  if (!student.enrolledCourses.includes(courseId)) {
    throw new ApiError(403, "Student is not enrolled in this course");
  }

  const assignments = await Assignment.find({ course: courseId });
  console.log("Assignemnts",assignments);
  const submission = await AssignmentSubmission.find({
    student: studentId,
    courses: courseId,
  });
  console.log("Submission", submission);

  const progress = assignments.map((assign) => {
    const submitted = submission.find((sub) => {
      return sub.assignment.toString() === assign._id.toString();
    });
    console.log("Submitted", submitted);

    return {
      assignmentTitle: assign.title,
      submitted: !!submitted,
      submittedAt: submitted?.createdAt || null,
      status: submitted?.status,
      feedback: submitted?.instructorFeedBack || null,
      score: submitted?.score ?? null,
    };
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      "getMyProgess fetched successfully",
      progress,
    ),
  );
});


export const getMyProgressVideo = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const { courseId } = req.params;

  if (!courseId) {
    throw new ApiError(400, "Course ID is required");
  }

  // 1. Get all lectures of this course
  const lectures = await Lecture.find({ course: courseId });

  if (!lectures.length) {
    return res.status(200).json(
      new ApiResponse(200, "No lectures found", {
        totalLectures: 0,
        completedLectures: 0,
        progressPercentage: 0,
        completedLectureIds: [],
      })
    );
  }

  const totalLectures = lectures.length;

  // 2. Get progress records of student for this course
  const progressRecords = await VideoProgress.find({
    student: studentId,
    course: courseId,
    isCompleted: true,
  });

  const completedLectureIds = progressRecords.map(
    (p) => p.lecture.toString()
  );

  const completedLectures = progressRecords.length;

  // 3. Calculate percentage
  const progressPercentage = Math.round(
    (completedLectures / totalLectures) * 100
  );

  // 4. Response
  return res.status(200).json(
    new ApiResponse(200, "Progress fetched successfully", {
      courseId,
      totalLectures,
      completedLectures,
      progressPercentage,
      completedLectureIds,
    })
  );
});

export const updateVideoProgress = async (req, res) => {
  const studentId = req.user._id;
  const { courseId, lectureId, isCompleted } = req.body;

  const progress = await VideoProgress.findOneAndUpdate(
    {
      student: studentId,
      course: courseId,
      lecture: lectureId,
    },
    {
      $set: {
        isCompleted,
      },
    },
    { upsert: true, new: true }
  );

  res.json({
    success: true,
    progress,
  });
};
