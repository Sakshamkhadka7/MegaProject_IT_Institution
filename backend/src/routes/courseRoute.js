import express from "express";
import userMiddleware from "../middleware/authMiddleware.js";
import { createCourse, deleteCourse, enrolledCourse, getAllCourse, getCourse, getMyCourse, updateCourse } from "../controllers/courseController.js";
import upload from "../middleware/upload.js";

const courseRoute=express.Router();

courseRoute.post("/createCourse",userMiddleware,upload.single("courseImage"),createCourse);
courseRoute.post("/enrolledCourse/:id",userMiddleware,enrolledCourse);
courseRoute.get("/getAllCourses",getAllCourse);
courseRoute.get("/getMyCourses",userMiddleware,getMyCourse);
courseRoute.get("/getCourse",getCourse);
courseRoute.put("/updateCourse/:id",userMiddleware,upload.single("courseImage"),updateCourse);
courseRoute.delete("/deleteCourse/:id",deleteCourse);

export default courseRoute;