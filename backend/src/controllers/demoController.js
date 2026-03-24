import Demo from "../models/demo.js";
import ApiResponse from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

export const bookDemo = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { courses, date, timeSlot } = req.body;

  const alreadyBooked = await Demo.findOne({
    userId,
    courses,
    date,
    timeSlot,
  });
  if (alreadyBooked) {
    return res.status(409).json(new ApiResponse(409, "Already Booked"));
  }

  const slotTaken = await Demo.findOne({
    courses,
    date,
    timeSlot,
  });

  if (slotTaken) {
    return res
      .status(409)
      .json(new ApiResponse(409, "This slot is already taken"));
  }

  const booking = await Demo.create({
    userId,
    courses,
    date,
    timeSlot,
  });

  return res.status(200).json(new ApiResponse(200, "Demo booked successfully",booking));
});
