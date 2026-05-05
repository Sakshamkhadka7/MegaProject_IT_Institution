import express from "express";
import userMiddleware from "../middleware/authMiddleware.js";
import { createReview, getAllReview } from "../controllers/reviewController.js";
import upload from "../middleware/upload.js";

const reviewRouter=express.Router();

reviewRouter.post("/createReview",userMiddleware,upload.single("photo"),createReview);
reviewRouter.get("/getReviewByCourse/:courseId",createReview);
reviewRouter.get("/getAllReview",getAllReview);

export default reviewRouter;