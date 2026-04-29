import express from "express";
import {
  getMyProgress,
  getStudentProgress,
} from "../controllers/progressController.js";
import userMiddleware from "../middleware/authMiddleware.js";

const progressRouter = express.Router();

progressRouter.get("/my/:courseId", userMiddleware, getMyProgress);
progressRouter.get("/getStudentProgress/:courseId/:studentId", getStudentProgress);



export default progressRouter;
