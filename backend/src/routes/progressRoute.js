import express from "express";
import {
  getMyProgress,
  getStudentProgress,
} from "../controllers/progressController.js";
import userMiddleware from "../middleware/authMiddleware.js";

const progressRouter = express.Router();

progressRouter.get("/:courseId/:studentId", getStudentProgress);
progressRouter.get("/my/:courseId", userMiddleware, getMyProgress);

export default progressRouter;
