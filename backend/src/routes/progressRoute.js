import express from "express";
import {
  getMyProgress,
  getMyProgressVideo,
  getStudentProgress,
  getStudentVideoProgress,
  updateVideoProgress,
} from "../controllers/progressController.js";
import userMiddleware from "../middleware/authMiddleware.js";

const progressRouter = express.Router();

progressRouter.get("/my/:courseId", userMiddleware, getMyProgress);
progressRouter.get(
  "/getStudentProgress/:courseId/:studentId",
  getStudentProgress,
);
progressRouter.post("/video/progress", userMiddleware, updateVideoProgress);
progressRouter.get(
  "/getProgressVideo/:courseId",
  userMiddleware,
  getMyProgressVideo,
);
progressRouter.get(
  "/student-video-progress/:courseId/:studentId",
  userMiddleware,
  getStudentVideoProgress,
);

export default progressRouter;
