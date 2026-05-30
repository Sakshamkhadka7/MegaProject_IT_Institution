import express from "express";
import userMiddleware from "../middleware/authMiddleware.js";
import {
  addLecture,
  createCourse,
  deleteCourse,
  deleteLecture,
  enrolledCourse,
  getAllCourse,
  getCourse,
  getInstructorCourse,
  getInstructorLectures,
  getMyCourse,
  getSingleCourseWithLectures,
  updateCourse,
  updateLecture,
} from "../controllers/courseController.js";
import upload from "../middleware/upload.js";
import uploadCloudinary from "../middleware/uploadMiddleware.js";

const courseRoute = express.Router();

courseRoute.post(
  "/createCourse",
  userMiddleware,
  uploadCloudinary.single("courseImage"),
  createCourse,
);
courseRoute.post("/enrolledCourse/:courseId", userMiddleware, enrolledCourse);
courseRoute.get("/getAllCourses", getAllCourse);
courseRoute.get("/getMyCourses", userMiddleware, getMyCourse);
courseRoute.get("/getCourse", getCourse);
courseRoute.put(
  "/updateCourse/:id",
  userMiddleware,
  uploadCloudinary.single("courseImage"),
  updateCourse,
);
courseRoute.delete("/deleteCourse/:id", userMiddleware, deleteCourse);
courseRoute.get("/getInstructorCourse", userMiddleware, getInstructorCourse);
courseRoute.post(
  "/add-lecture/:courseId",
  userMiddleware,
  uploadCloudinary.single("video"),
  addLecture,
);

courseRoute.get(
  "/course/:courseId/lectures",
  userMiddleware,
  getSingleCourseWithLectures,
);

courseRoute.delete("/lecture/:lectureId", userMiddleware, deleteLecture);
courseRoute.get("/getInstructorLectures",userMiddleware,getInstructorLectures)
courseRoute.put(
  "/updateLecture/:lectureId",
  userMiddleware,
  uploadCloudinary.single("video"),
  updateLecture
);

export default courseRoute;
