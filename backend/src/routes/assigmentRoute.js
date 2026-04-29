import express from "express";
import userMiddleware from "../middleware/authMiddleware.js";
import {
  assignmentSubmission,
  createAssignment,
  deleteAssignment,
  getAssignmentByCourse,
  getSubmittedAssignments,
  instructorFeedBack,
  SubmittedAssignmentForInstructor,
} from "../controllers/assignmentController.js";
import upload from "../middleware/upload.js";

const assigmentRouter = express.Router();

assigmentRouter.post(
  "/createAssignment/:id",
  userMiddleware,
  upload.single("fileUrl"),
  createAssignment,
);
assigmentRouter.get("/getCourse/:id", getAssignmentByCourse);
assigmentRouter.post(
  "/assignmentSubmission/:id",
  userMiddleware,
  upload.single("submittedFile"),
  assignmentSubmission,
);
assigmentRouter.get("/getSubmittedAssigment", userMiddleware, getSubmittedAssignments);
assigmentRouter.delete(
  "/deleteAssignment/:id",
  userMiddleware,
  deleteAssignment,
);
assigmentRouter.get(
  "/submittedInstructor",
  userMiddleware,
  SubmittedAssignmentForInstructor,
);
assigmentRouter.post(
  "/instructorFeedBack/:id",
  userMiddleware,
  instructorFeedBack,
);

export default assigmentRouter;
