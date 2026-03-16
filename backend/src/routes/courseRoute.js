import express from "express";
import userMiddleware from "../middleware/authMiddleware.js";
import { createCourse, updateCourse } from "../controllers/courseController.js";

const courseRoute=express.Router();

courseRoute.post("/createCourse",userMiddleware,createCourse);
courseRoute.put("/updateCourse/:id",userMiddleware,updateCourse);

export default courseRoute;