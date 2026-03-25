import express from "express";
import upload from "../middleware/upload.js";
import {
  getMe,
  login,
  logout,
  registerStudent,
} from "../controllers/studentController.js";
import userMiddleware from "../middleware/authMiddleware.js";
import { enrolledCourse } from "../controllers/courseController.js";

const studentRoute = express.Router();

studentRoute.post("/register", upload.single("avatar"), registerStudent);
studentRoute.post("/login", login);
studentRoute.get("/logout", userMiddleware, logout);
studentRoute.get("/getMe", userMiddleware, getMe);
studentRoute.post("/enrolledCourse",userMiddleware,enrolledCourse);

export default studentRoute;
