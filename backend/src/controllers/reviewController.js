import Review from "../models/review.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createReview = asyncHandler(async (req, res) => {
  const { user, course, rating, comment } = req.body;
  if (!user || !course || !rating || !comment) {
    throw new ApiError(403, "All fields are madatory");
  }

  const review = await Review.create({
    user: user,
    course: course,
    rating: rating,
    comment: comment,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Review made successfully", review));
});
