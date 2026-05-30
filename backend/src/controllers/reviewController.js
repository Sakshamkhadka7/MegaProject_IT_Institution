import Review from "../models/review.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export const createReview = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const { course, rating, comment } = req.body;

  if (!user || !course || !rating || !comment) {
    throw new ApiError(403, "All fields are madatory");
  }

  let photo = null;

  if (req.file) {
    const uploadedImage = await uploadToCloudinary(
      req.file.buffer,
      "review-images",
    );

    photo = uploadedImage.secure_url;
  }

  const review = await Review.create({
    user,
    course,
    rating,
    comment,
    photo,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Review made successfully", review));
});

export const getReviewByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const review = await Review.findOne({ course: courseId });
  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Review fetcehd successfully", review));
});

export const getAllReview = asyncHandler(async (req, res) => {
  const review = await Review.find();

  if (review.length < 0) {
    throw new ApiError(404, "No review found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Review fetched successfully", review));
});
