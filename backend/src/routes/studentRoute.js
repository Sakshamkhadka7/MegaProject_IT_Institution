import express from "express";
import upload from "../middleware/upload.js";
import {
  activateStudent,
  addInstructor,
  deleteStudent,
  getAllUsers,
  getInstructor,
  getMe,
  getStudent,
  login,
  logout,
  registerStudent,
} from "../controllers/studentController.js";
import userMiddleware from "../middleware/authMiddleware.js";
import { enrolledCourse } from "../controllers/courseController.js";
import uploadCloudinary from "../middleware/uploadMiddleware.js";

const studentRoute = express.Router();



studentRoute.post("/register", uploadCloudinary.single("avatar"), registerStudent);
studentRoute.post("/login", login);
studentRoute.get("/logout", userMiddleware, logout);
studentRoute.get("/getMe", userMiddleware, getMe);
studentRoute.get("/getAllUsers",userMiddleware,getAllUsers);
studentRoute.get("/getStudents",userMiddleware,getStudent);
studentRoute.post("/enrolledCourse/:courseId",userMiddleware,enrolledCourse);
studentRoute.get("/getInstructor",getInstructor);
studentRoute.patch("/deleteUser/:id",userMiddleware,deleteStudent)
studentRoute.patch("/activate/:id",userMiddleware,activateStudent)
studentRoute.post("/addInstructor", uploadCloudinary.single("avatar"),userMiddleware, addInstructor);


export default studentRoute;
