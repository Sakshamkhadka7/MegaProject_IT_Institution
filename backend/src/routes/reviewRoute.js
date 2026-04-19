import express from "express";
import userMiddleware from "../middleware/authMiddleware.js";
import { createReview } from "../controllers/reviewController.js";

const reviewRouter=express.Router();

reviewRouter.post("/createReview",userMiddleware,createReview);
reviewRouter.get("/getReviewByCourse/:courseId",createReview);

export default reviewRouter;