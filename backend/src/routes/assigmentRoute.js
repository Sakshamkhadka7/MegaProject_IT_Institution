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

const assigmentRouter = express.Router();

assigmentRouter.post("/createAssignment", userMiddleware, createAssignment);
assigmentRouter.get("/getCourse/:id", getAssignmentByCourse);
assigmentRouter.post(
  "/assignmentSubmission",
  userMiddleware,
  assignmentSubmission,
);
assigmentRouter.get("/getAssigment", userMiddleware, getSubmittedAssignments);
assigmentRouter.delete("/deleteAssignment", deleteAssignment);
assigmentRouter.post(
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
