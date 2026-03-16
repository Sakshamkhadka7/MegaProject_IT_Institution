import express from "express";
import userMiddleware from "../middleware/authMiddleware.js";
import { createCourse } from "../controllers/courseController.js";

const courseRoute=express.Router();

courseRoute.post("/createCourse",userMiddleware,createCourse);

export default courseRoute;