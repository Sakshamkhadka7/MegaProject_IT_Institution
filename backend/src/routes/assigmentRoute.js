import express from "express";
import userMiddleware from "../middleware/authMiddleware.js";
import {
  assignmentSubmission,
  createAssignment,
  deleteAssignment,
  getAssignmentByCourse,
  getInstructorAssignment,
  getSubmittedAssignments,
  instructorFeedBack,
  SubmittedAssignmentForInstructor,
} from "../controllers/assignmentController.js";
import upload from "../middleware/upload.js";
import uploadCloudinary from "../middleware/uploadMiddleware.js";





const assigmentRouter = express.Router();

assigmentRouter.post(
  "/createAssignment/:id",
  userMiddleware,
  uploadCloudinary.single("fileUrl"),
  createAssignment,
);
assigmentRouter.get("/getCourse/:id", getAssignmentByCourse);
assigmentRouter.get("/getInstructorAssignment",userMiddleware,getInstructorAssignment);
assigmentRouter.post(
  "/assignmentSubmission/:id",
  userMiddleware,
  uploadCloudinary.single("submittedFile"),
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
