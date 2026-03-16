import express from "express";
import userMiddleware from "../middleware/authMiddleware.js";
import { createCourse, deleteCourse, updateCourse } from "../controllers/courseController.js";

const courseRoute=express.Router();

courseRoute.post("/createCourse",userMiddleware,createCourse);
courseRoute.put("/updateCourse/:id",userMiddleware,updateCourse);
courseRoute.delete("/deleteCourse/:id",deleteCourse);

export default courseRoute;